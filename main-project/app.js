/**
 * app.js - النسخة النهائية (بيانات القطيع + اتصال آمن عبر Netlify Functions)
 */


const analyzeBtn = document.getElementById('analyzeBtn');
const loadingState = document.getElementById('loadingState');
const resultsSection = document.getElementById('resultsArea');
const bitar = document.getElementById('bitar'); // الحفاظ على متغيرك
const uploadGrid = document.getElementById('uploadGrid');


const flockTypeInput = document.getElementById('flock-type');
const flockAgeInput = document.getElementById('flock-age');
const flockCountInput = document.getElementById('flock-count');
const mortalityInput = document.getElementById('mortality-rate');

const symptomsList = [
    "فقدان الشهية", "نقص استهلاك العلف والماء", "الهزال ونقص الوزن", "انتفاش الريش",
    "زيادة النفوق أو نفوق مفاجئ", "صعوبة أو تسارع التنفس", "التنفس بفم مفتوح",
    "إفرازات أنفية أو عينية", "تورم الوجه أو الجيوب الأنفية", "شحوب أو ازرقاق العرف والدلايات",
    "إسهال (مائي، أخضر، أبيض، دموي)", "اتساخ منطقة المجمع", "بطء النمو وسوء التحويل الغذائي",
    "عدم الاتزان أو العرج", "شلل الأجنحة أو الأرجل", "التواء الرقبة أو أعراض عصبية",
    "تورم المفاصل أو صعوبة الحركة", "انخفاض أو توقف إنتاج البيض", "بيض مشوه أو رقيق القشرة"
];

let caseImages = {
    chicken: null,
    feces: null,
    organ: null
};
let selectedSymptoms = [];


function checkAllInputsAndToggle() {
    const hasSymptoms = selectedSymptoms.length > 0;
    
    
    const isTypeFilled = flockTypeInput && flockTypeInput.value !== "";
    const isAgeFilled = flockAgeInput && flockAgeInput.value !== "";
    const isCountFilled = flockCountInput && flockCountInput.value.trim() !== "";
    const isMortalityFilled = mortalityInput && mortalityInput.value.trim() !== "";

    if (hasSymptoms && isTypeFilled && isAgeFilled && isCountFilled && isMortalityFilled) {
        if(uploadGrid) {
            uploadGrid.classList.remove('locked-section');
            uploadGrid.classList.add('unlocked');
        }
    } else {
        if(uploadGrid) {
            uploadGrid.classList.add('locked-section');
            uploadGrid.classList.remove('unlocked');
        }
    }
}

if(flockTypeInput) flockTypeInput.addEventListener('change', checkAllInputsAndToggle);
if(flockAgeInput) flockAgeInput.addEventListener('change', checkAllInputsAndToggle);
if(flockCountInput) flockCountInput.addEventListener('input', checkAllInputsAndToggle);
if(mortalityInput) mortalityInput.addEventListener('input', checkAllInputsAndToggle);


const symptomsContainer = document.getElementById('symptomsChecklist');
if (symptomsContainer) {
    symptomsList.forEach(symptom => {
        const label = document.createElement('label');
        label.className = 'checkbox-wrapper';
        label.innerHTML = `
            <input type="checkbox" value="${symptom}" class="symptom-checkbox">
            ${symptom}
        `;
        symptomsContainer.appendChild(label);
    });

    const checkboxes = document.querySelectorAll('.symptom-checkbox');
    checkboxes.forEach(box => {
        box.addEventListener('change', () => {
            selectedSymptoms = Array.from(checkboxes)
                .filter(i => i.checked)
                .map(i => i.value);
            
            checkAllInputsAndToggle();
        });
    });
}

const organSelect = document.getElementById('organ-type');
const organInput = document.getElementById('input-organ');
const organArea = document.getElementById('area-organ');

if (organSelect && organInput && organArea) {
    organSelect.addEventListener('change', function () {
        if (this.value !== "") {
            organInput.disabled = false;
            organArea.classList.remove('disabled-upload');
            const pText = organArea.querySelector('p');
            if (pText) pText.textContent = "اضغط لرفع صورة " + this.options[this.selectedIndex].text;
        }
    });

    organArea.addEventListener('click', function () {
        if (organInput.disabled) {
            alert("⚠️ يرجى تحديد العضو من القائمة أولاً لضمان دقة التشخيص.");
        } else {
            organInput.click();
        }
    });
}


function handleUpload(inputId, previewId, areaId, type) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const area = document.getElementById(areaId);

    if (!input) return;

    input.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                caseImages[type] = e.target.result;
                if (preview) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                }

                const icon = area.querySelector('.upload-icon');
                const text = area.querySelector('p');
                if (icon) icon.style.display = 'none';
                if (text) text.style.display = 'none';

                checkAnalyzeButton();
            };
            reader.readAsDataURL(file);
        }
    });
}

handleUpload('input-chicken', 'preview-chicken', 'area-chicken', 'chicken');
handleUpload('input-feces', 'preview-feces', 'area-feces', 'feces');
handleUpload('input-organ', 'preview-organ', 'area-organ', 'organ');

function checkAnalyzeButton() {
    const hasAnyImage = caseImages.chicken || caseImages.feces || caseImages.organ;
    if (analyzeBtn) analyzeBtn.disabled = !hasAnyImage;
}


if (analyzeBtn) {
    analyzeBtn.addEventListener('click', async () => {
        analyzeBtn.disabled = true;
        if (resultsSection) resultsSection.style.display = 'none';
        if (loadingState) loadingState.style.display = 'block';

        try {
            const reportData = await getAnalysisFromGPT();
            renderReport(reportData);

            if (loadingState) loadingState.style.display = 'none';
            if (resultsSection) {
                resultsSection.style.display = 'block';
                resultsSection.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error(error);
            alert("حدث خطأ: " + error.message);
            if (loadingState) loadingState.style.display = 'none';
            analyzeBtn.disabled = false;
        }
    });
}

async function getAnalysisFromGPT() {
    const organType = document.getElementById('organ-type') ? document.getElementById('organ-type').value : "Unspecified";
    
    const flockType = flockTypeInput ? flockTypeInput.value : "Unknown";
    const flockAge = flockAgeInput ? flockAgeInput.value : "Unknown";
    const flockCount = flockCountInput ? flockCountInput.value : "Unknown";
    const mortality = mortalityInput ? mortalityInput.value : "Unknown";

    const historyText = selectedSymptoms.length > 0 ? selectedSymptoms.join(", ") : "No specific history provided";

    const promptText = `
    Act as a highly experienced Poultry Veterinarian and Pathologist. Analyze the attached images combined as a SINGLE CASE.
    
    Context Provided:
    - **Flock Data:** Type: ${flockType}, Age: ${flockAge}, Size: ${flockCount}, Mortality: ${mortality}
    - **Clinical History / Symptoms Reported:** ${historyText}
    - Chicken Image: ${caseImages.chicken ? "Provided" : "Not provided"}
    - Feces Image: ${caseImages.feces ? "Provided" : "Not provided"}
    - Organ Image: ${caseImages.organ ? "Provided" : "Not provided"} 
    ${caseImages.organ ? `(Selected Organ: **${organType}**)` : ""}
    
    CRITICAL INSTRUCTIONS:
    1. **Correlate findings:** Connect symptoms from all images.
    2. **Probability:** MUST be a percentage (e.g., '95%').
    3. **Diagnosis Reasoning:** - If Chicken exists: Analyze Head, Balance, Movement, Eyes, Feathers.
        - If Feces exists: Analyze Color, Consistency.
        - **If Organ exists (${organType}):** You MUST provide a professional pathological description. Describe: Enlargement, Color (pale/dark), Lesions (spots, necrosis, hemorrhages), Texture, and Fibrin presence. Use specific terms like "Multifocal necrosis", "Petechial hemorrhage", "Enlarged/Hepatomegaly".
    4. **Diagnosis Summary:** Synthesize all findings into a conclusion.
    
    Produce a JSON report strictly following this structure in ARABIC:
    {
        "1_chicken_type": { "title": "e.g.(Broiler chicken, layer chicken, breeder chicken)", "value": "String", "reason": "String" },
        "2_weight_est": { "title": "الوزن التقديري", "value": "String" },
        "3_age_est": { "title": "العمر التقديري", "value": "String" },
        "4_primary_diagnosis": { 
            "disease_name_ar": "String",
            "disease_name_en": "String",
            "probability": "String (e.g. '95%')",
            "diagnosis_summary": "String (الخلاصة)",
            "detailed_reasoning": {
                "head": "String ( مثال: انحناء شديد والتفاف غير طبيعي للرأس والرقبة باتجاه الأسفل/الجانب)",
                "balance": "String (مثال: وضعية الجسم غير مستقرة، ما يدل على خلل في التوازن العصبي)",
                "movement": "String (مثال: تُظهر الصورة صعوبة واضحة في التحكم بوضع الرأس)",
                "eyes": "String (مثال: تبدو مفتوحة لكن اتجاه الرأس غير طبيعي)",
                "feathers": "String (مثال: مظهره غير مرتب نسبيًا، ما قد يدل على إجهاد أو مرض)",
                "feces_color": "String (Or 'N/A')",
                "feces_consistency": "String (Or 'N/A')",
                "feces_context": "String (Where is the feces? Or 'N/A')",
                "organ_analysis": "String (وصف دقيق للعضو المختار - الآفات واللون والحجم. Or 'N/A' if no organ)"
            },
            "links": ["https://www.google.com/search?q=DISEASE_NAME_EN+symptoms+poultry"]
        },
        "5_alternatives": { 
            "diseases": [ 
                {
                    "name_ar": "String (اسم المرض بالعربية)", 
                    "name_en": "String (English Name)", 
                    "prob": "String (e.g. '30%')", 
                    "reason": "String (One concise sentence explaining why this is a possibility)", 
                    "link": "https://www.google.com/search?q=DISEASE_NAME_EN+poultry"
                } 
            ] 
        },
        "6_treatment": { 
            "isolation": "String (مثال: مطلوب عزل الطائر أو وضعه بمكان آخر)", 
            "feed_water": "String (إضافات العلف والماء والتغذية المطلوبة)", 
            "medication": "String (Drug names, dosages, and method of administration)", 
            "environment": "String (Humidity, temperature, chicken house, ventilation, and required adjustments)", 
            "tests": "String (e.g.(PCR, RT-PCR, ELISA, Hemagglutination Inhibition (HI) test, Rapid Plate Agglutination (RPA), Bacterial culture and antibiotic sensitivity testing))", 
            "link": "https://www.google.com/search?q=DISEASE_NAME_EN+treatment+protocol+poultry" 
        },
        "7_prevention": { "steps": "String", "link": "String" }
    }
    If images are unrelated to poultry, return error JSON.
    `;

    let contentArray = [{ type: "text", text: promptText }];

    if (caseImages.chicken) contentArray.push({ type: "image_url", image_url: { url: caseImages.chicken } });
    if (caseImages.feces) contentArray.push({ type: "image_url", image_url: { url: caseImages.feces } });
    if (caseImages.organ) contentArray.push({ type: "image_url", image_url: { url: caseImages.organ } });

    const response = await fetch("/.netlify/functions/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // لا نحتاج Authorization هنا
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [{ role: "user", content: contentArray }],
            response_format: { type: "json_object" },
            temperature: 0.2
        })
    });

    const data = await response.json();
    if (!data.choices || !data.choices[0].message.content) throw new Error("No response from AI");
    return JSON.parse(data.choices[0].message.content);
}

function renderReport(data) {
    bitar.innerHTML = ''; 

    if (data.error) {
        bitar.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
        return;
    }

    createCard('fas fa-dna', 'نوع الدجاجة', `
        <div style="padding: 5px;">
            <div style="display:flex; align-items:center; gap: 10px; margin-bottom: 10px;">
                <strong style="font-size:1.2rem; color:#333;">النوع:</strong> 
                <span style="font-size:1.2rem; font-weight:800; color:#e65100; background:#fff3e0; padding:2px 10px; border-radius:4px;">
                    ${data["1_chicken_type"].value}
                </span>
            </div>
            <div class="reason-highlight" style="background:#f9f9f9; padding:10px; border-radius:8px; border-right:4px solid #e65100;">
                <strong style="color:#555;">سبب التصنيف:</strong> 
                <span style="color:#666;">${data["1_chicken_type"].reason}</span>
            </div>
        </div>
    `);

    createCard('fas fa-weight-hanging', 'التقديرات الحيوية', `
        <div style="display:flex; gap:15px; flex-wrap: wrap;">
            <div style="flex:1; background:#f9f9f9; border-radius:10px; padding:12px; display:flex; align-items:center; gap:15px; border:1px solid #eee;">
                <div style="background:#e8eaf6; color:#3949ab; width:50px; height:50px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.4rem;"><i class="fas fa-weight"></i></div>
                <div><div style="font-weight:800; font-size:1.2rem; color:#333; margin-bottom:4px;">${data["2_weight_est"].value}</div><div style="font-size:0.9rem; color:#666; font-weight:bold;">الوزن التقديري</div></div>
            </div>
            <div style="flex:1; background:#f9f9f9; border-radius:10px; padding:12px; display:flex; align-items:center; gap:15px; border:1px solid #eee;">
                <div style="background:#e8eaf6; color:#3949ab; width:50px; height:50px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.4rem;"><i class="fas fa-clock"></i></div>
                <div><div style="font-weight:800; font-size:1.2rem; color:#333; margin-bottom:4px;">${data["3_age_est"].value}</div><div style="font-size:0.9rem; color:#666; font-weight:bold;">العمر التقديري</div></div>
            </div>
        </div>
    `);

   let linksHtml = data["4_primary_diagnosis"].links.map(l => `<a href="${l}" target="_blank" style="color:#b78a00; text-decoration:underline;">اضغط هنا</a>`).join(' | ');
    const reasons = data["4_primary_diagnosis"].detailed_reasoning;
    
    let fecesHtml = '';
    if (reasons.feces_color && reasons.feces_color !== 'N/A') {
        fecesHtml = `
        <div style="margin-top:15px; border-top:1px dashed #ccc; padding-top:15px;">
            <h6 style="color:#795548; margin-bottom:10px; font-weight:bold; display:flex; align-items:center; gap:5px;"><i class="fas fa-flask"></i> تحليل عينة البراز:</h6>
            <div style="margin-bottom:5px; display:flex; gap:5px;"><strong style="color:#5d4037; min-width:90px;"> اللون:</strong> <span style="color:#555;">${reasons.feces_color}</span></div>
            <div style="margin-bottom:5px; display:flex; gap:5px;"><strong style="color:#5d4037; min-width:90px;"> القوام:</strong> <span style="color:#555;">${reasons.feces_consistency}</span></div>
            <div style="display:flex; gap:5px;"><strong style="color:#5d4037; min-width:90px;"> السياق:</strong> <span style="color:#555;">${reasons.feces_context}</span></div>
        </div>`;
    }

    let organHtml = '';
    const selectedOrganName = document.getElementById('organ-type') ? document.getElementById('organ-type').options[document.getElementById('organ-type').selectedIndex].text : "عضو";
    if (reasons.organ_analysis && reasons.organ_analysis !== 'N/A') {
        organHtml = `
        <div style="margin-top:15px; border-top:1px dashed #ccc; padding-top:15px;">
            <h6 style="color:#c62828; margin-bottom:10px; font-weight:bold; display:flex; align-items:center; gap:5px;"><i class="fas fa-heartbeat"></i> الفحص التشريحي (${selectedOrganName}):</h6>
            <div style="color:#444; font-size:0.95rem; line-height:1.6; padding-right:10px;">${reasons.organ_analysis}</div>
        </div>`;
    }

    const symptomsHtml = `
        <div style="margin-top:15px; background:#f8f9fa; border:1px solid #e9ecef; border-radius:8px; padding:15px;">
            <h5 style="color:#3949ab; margin-bottom:10px; font-weight:bold; display:flex; align-items:center; gap:5px;"><i class="fas fa-dove"></i> التحليل الظاهري (الدجاجة):</h5>
            <div style="padding-right:10px;">
                <div style="margin-bottom:8px; display:flex; gap:5px;"><strong style="color:#333; min-width:90px;"> وضعية الرأس:</strong> <span style="color:#555;">${reasons.head}</span></div>
                <div style="margin-bottom:8px; display:flex; gap:5px;"><strong style="color:#333; min-width:90px;"> التوازن:</strong> <span style="color:#555;">${reasons.balance}</span></div>
                <div style="margin-bottom:8px; display:flex; gap:5px;"><strong style="color:#333; min-width:90px;"> الحركة:</strong> <span style="color:#555;">${reasons.movement}</span></div>
                <div style="margin-bottom:8px; display:flex; gap:5px;"><strong style="color:#333; min-width:90px;"> العين:</strong> <span style="color:#555;">${reasons.eyes}</span></div>
                <div style="display:flex; gap:5px;"><strong style="color:#333; min-width:90px;"> الريش:</strong> <span style="color:#555;">${reasons.feathers}</span></div>
            </div>
            ${fecesHtml}
            ${organHtml}
        </div>
    `;

    createCard('fas fa-user-md', 'التشخيص الأساسي', `
        <div style="padding: 5px;">
            <div style="margin-bottom: 15px;">
                <h3 style="color:#c62828; margin:0 0 5px 0; font-weight:900; font-size:1.6rem; line-height:1.2;">${data["4_primary_diagnosis"].disease_name_ar}</h3>
                <h4 style="color:#555; font-weight:bold; margin:0; font-family:sans-serif; font-size:1.1rem;">${data["4_primary_diagnosis"].disease_name_en}</h4>
            </div>
            <div style="display:flex; align-items:center; gap: 10px; margin-bottom: 20px;">
                <strong style="color:#333; font-size:1.1rem;">نسبة الاشتباه:</strong> 
                <span style="background:#ffebee; color:#c62828; padding:4px 15px; border-radius:6px; font-weight:900; font-size:1.3rem; border:1px solid #ffcdd2;">${data["4_primary_diagnosis"].probability}</span>
            </div>
            ${symptomsHtml}
            <div style="margin-top:15px; background:#e3f2fd; padding:12px; border-radius:6px; border-right:4px solid #2196f3;">
                <strong style="color:#0d47a1; display:block; margin-bottom:5px;">💡 الخلاصة والربط بين الأعراض:</strong>
                <p style="margin:0; color:#333; font-size:0.95rem; line-height:1.6;">${data["4_primary_diagnosis"].diagnosis_summary}</p>
            </div>
            <div class="source-box"><i class="fas fa-link"></i> المراجع: ${linksHtml}</div>
        </div>
    `, true);

   let altHtml = '<ul style="list-style:none; padding:0; margin:0;">';
    data["5_alternatives"].diseases.forEach(d => {
        altHtml += `
        <li style="background:#fff; border:1px solid #eee; border-radius:12px; padding:15px; margin-bottom:12px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); transition: transform 0.2s;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <div><div style="font-weight:900; font-size:1.1rem; color:#2c3e50;">${d.name_ar}</div><div style="font-size:0.85rem; color:#95a5a6; font-family:sans-serif;">${d.name_en}</div></div>
                <span style="background:#e3f2fd; color:#1565c0; padding:5px 12px; border-radius:8px; font-weight:900; font-size:1rem; border:1px solid #bbdefb;">${d.prob}</span>
            </div>
            <div style="font-size:0.95rem; color:#555; margin-bottom:10px; padding-right:10px; border-right:3px solid #cfd8dc; line-height:1.5;"><strong style="color:#455a64;">السبب:</strong> ${d.reason}</div>
            <div style="text-align:left;"><a href="${d.link}" target="_blank" style="font-size:0.85rem; color:#3949ab; text-decoration:none; font-weight:bold; display:inline-flex; align-items:center; gap:5px;"><i class="fas fa-external-link-alt"></i> اقرأ المزيد</a></div>
        </li>`;
    });
    altHtml += '</ul>';
    createCard('fas fa-list-ol', 'التشخيص التفريقي', altHtml);

    const tr = data["6_treatment"];
    const trHtml = `
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="background:#fff; border:1px solid #ffcdd2; border-radius:10px; padding:15px;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;"><div style="background:#ffebee; color:#c62828; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.1rem;"><i class="fas fa-door-closed"></i></div><strong style="font-size:1.1rem; color:#c62828;">إجراءات العزل:</strong></div>
                <div style="color:#555; line-height:1.6; padding-right:46px;">${tr.isolation}</div>
            </div>
            <div style="background:#fff; border:1px solid #bbdefb; border-radius:10px; padding:15px;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;"><div style="background:#e3f2fd; color:#1565c0; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.1rem;"><i class="fas fa-utensils"></i></div><strong style="font-size:1.1rem; color:#1565c0;">التغذية والماء:</strong></div>
                <div style="color:#555; line-height:1.6; padding-right:46px;">${tr.feed_water}</div>
            </div>
            <div style="background:#fdf2ff; border:1px solid #e1bee7; border-radius:10px; padding:15px;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;"><div style="background:#fff; color:#8e24aa; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.1rem; border:1px solid #ba68c8;"><i class="fas fa-prescription-bottle-alt"></i></div><strong style="font-size:1.1rem; color:#7b1fa2;">البروتوكول العلاجي (الدواء):</strong></div>
                <div style="color:#333; font-weight:bold; line-height:1.6; padding-right:46px;">${tr.medication}</div>
            </div>
            <div style="background:#fff; border:1px solid #c8e6c9; border-radius:10px; padding:15px;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;"><div style="background:#e8f5e9; color:#2e7d32; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.1rem;"><i class="fas fa-temperature-high"></i></div><strong style="font-size:1.1rem; color:#2e7d32;">البيئة والحرارة:</strong></div>
                <div style="color:#555; line-height:1.6; padding-right:46px;">${tr.environment}</div>
            </div>
            <div style="background:#fff; border:1px solid #ffe0b2; border-radius:10px; padding:15px;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;"><div style="background:#fff3e0; color:#ef6c00; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.1rem;"><i class="fas fa-vial"></i></div><strong style="font-size:1.1rem; color:#ef6c00;">الفحوصات المخبرية:</strong></div>
                <div style="color:#555; line-height:1.6; padding-right:46px;">${tr.tests}</div>
            </div>
        </div>
    `;

    createCard('fas fa-pills', 'خطة العلاج المتكاملة', `${trHtml}<div style="margin-top:15px; text-align:left;"><a href="${tr.link}" target="_blank" style="background:#3949ab; color:#fff; padding:8px 15px; border-radius:6px; text-decoration:none; font-size:0.9rem; display:inline-flex; align-items:center; gap:5px;"><i class="fas fa-external-link-alt"></i> اضغط هنا </a></div>`);

   createCard('fas fa-shield-alt', 'الوقاية', `
        <div style="white-space: pre-line; line-height:1.8; color:#333;">${data["7_prevention"].steps}</div>
        <div class="source-box"><a href="${data["7_prevention"].link}" target="_blank">🔗 اضغط هنا </a></div>
    `);
}


function createCard(icon, title, content, isOpen = false) {
    const card = document.createElement('div');
    card.className = 'diagnosis-card'; 
    if (isOpen) card.classList.add('active');

    card.innerHTML = `
        <div class="card-header">
            <div class="card-title"><i class="${icon}"></i> ${title}</div>
            <i class="fas fa-chevron-down toggle-icon"></i>
        </div>
        <div class="card-body">${content}</div>
    `;
    
    card.querySelector('.card-header').addEventListener('click', () => {
        card.classList.toggle('active');
    });

    bitar.appendChild(card);
}
