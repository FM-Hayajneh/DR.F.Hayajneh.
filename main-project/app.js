/**
 * app.js - نسخة شاملة (تعدد صور + أعضاء ديناميكية + تعدد لغات)
 */

const analyzeBtn = document.getElementById('analyzeBtn');
const loadingState = document.getElementById('loadingState');
const resultsSection = document.getElementById('resultsArea');
const bitar = document.getElementById('bitar');
const uploadGrid = document.getElementById('uploadGrid');
const addOrganBtn = document.getElementById('addOrganBtn');
const dynamicOrgansArea = document.getElementById('dynamic-organs-area');
const langBtn = document.getElementById('langBtn');

// المدخلات
const flockTypeInput = document.getElementById('flock-type');
const flockAgeInput = document.getElementById('flock-age');
const flockCountInput = document.getElementById('flock-count');
const mortalityInput = document.getElementById('mortality-rate');

// --- إعدادات اللغة ---
let currentLang = 'ar';

const dictionary = {
    ar: {
        logo: "المحلل البيطري الذكي", nav: "التحليل البيطري", new: "تحليل جديد",
        heroT: "المحلل البيطري", heroD: "نظام متقدم يعتمد على الذكاء الاصطناعي لتشخيص أمراض الدواجن بدقة.",
        stat1: "نقاط تشخيصية", stat2: "دقة التحليل %", stat3: "ساعة خدمة",
        uploadT: "رفع الصور للتشخيص", uploadD: "قم باختيار الأعراض أولاً، ثم ارفع الصور المتاحة لزيادة الدقة",
        flockT: "1. بيانات القطيع (إجباري):",
        lblType: "نوع القطيع:", lblAge: "العمر التقريبي:", lblCount: "العدد الكلي:", lblMort: "نسبة النفوق:",
        phCount: "مثال: 5000", phMort: "مثال: 50 طير أو 1%",
        sympT: "اختر الأعراض الملاحظة:",
        cardChk: "صور الدجاجة (المظهر)", hintChk: "اضغط لرفع صورة أو أكثر",
        cardOth: "صور إضافية / فضلات", hintOth: "اضغط لرفع صور إضافية",
        btnAdd: "إضافة عضو تشريحي آخر",
        btnAnlz: "بدء التحليل الشامل",
        loadT: "جاري تحليل الصور...", loadD: "يقوم الذكاء الاصطناعي الآن بربط الأعراض بالصور المرفقة",
        resT: "التقرير الطبي المفصل",
        noteT: "تنويه هام", note1: "هذا النظام يستخدم تقنيات الذكاء الاصطناعي.", note2: "النتائج للاسترشاد الطبي فقط.",
        foot: "المحلل البيطري",
        // القوائم
        optTypeDef: "-- اختر النوع --", optType1: "الجدات", optType2: "الأمهات", optType3: "اللاحم", optType4: "البياض",
        optAgeDef: "-- اختر العمر --",
        // الأعضاء
        organHead: "عضو تشريحي إضافي", organLbl: "اختر العضو:", organHint: "اختر العضو ثم اضغط للرفع",
        organList: {
            "Liver": "الكبد", "Intestine": "الأمعاء", "Heart": "القلب", 
            "Gizzard": "القونصة", "Lungs": "الرئتان", "Kidney": "الكلى", 
            "Spleen": "الطحال", "Brain": "الدماغ", "Other": "آخر"
        }
    },
    en: {
        logo: "Smart Vet Analyst", nav: "Veterinary Analysis", new: "New Analysis",
        heroT: "Veterinary Analyst", heroD: "Advanced AI system for accurate poultry disease diagnosis.",
        stat1: "Diagnostic Points", stat2: "Accuracy %", stat3: "Hours Service",
        uploadT: "Upload Images", uploadD: "Select symptoms first, then upload available images for accuracy",
        flockT: "1. Flock Data (Required):",
        lblType: "Flock Type:", lblAge: "Approx. Age:", lblCount: "Total Count:", lblMort: "Mortality Rate:",
        phCount: "e.g: 5000", phMort: "e.g: 50 birds or 1%",
        sympT: "Observed Symptoms:",
        cardChk: "Chicken Images (Appearance)", hintChk: "Click to upload images",
        cardOth: "Extra Images / Feces", hintOth: "Click to upload extra images",
        btnAdd: "Add Another Organ",
        btnAnlz: "Start Full Analysis",
        loadT: "Analyzing Images...", loadD: "AI is correlating symptoms with uploaded images now",
        resT: "Detailed Medical Report",
        noteT: "Important Disclaimer", note1: "This system uses Generative AI technology.", note2: "Results are for guidance only.",
        foot: "Vet Analyst",
        // Options
        optTypeDef: "-- Select Type --", optType1: "Grandparents", optType2: "Parents", optType3: "Broilers", optType4: "Layers",
        optAgeDef: "-- Select Age --",
        // Organs
        organHead: "Additional Organ", organLbl: "Select Organ:", organHint: "Select organ then click to upload",
        organList: {
            "Liver": "Liver", "Intestine": "Intestine", "Heart": "Heart", 
            "Gizzard": "Gizzard", "Lungs": "Lungs", "Kidney": "Kidney", 
            "Spleen": "Spleen", "Brain": "Brain", "Other": "Other"
        }
    }
};

const symptomsAr = [
    "فقدان الشهية", "نقص استهلاك العلف", "الهزال", "انتفاش الريش",
    "زيادة النفوق", "صعوبة التنفس", "إفرازات", "تورم الوجه", 
    "إسهال", "اتساخ المجمع", "بطء النمو", "عرج/عدم اتزان", 
    "التواء الرقبة", "انخفاض البيض", "بيض مشوه"
];
const symptomsEn = [
    "Loss of appetite", "Reduced feed intake", "Emaciation", "Ruffled feathers",
    "Increased mortality", "Respiratory distress", "Discharge", "Swollen face",
    "Diarrhea", "Dirty vent", "Stunted growth", "Lameness",
    "Twisted neck", "Drop in eggs", "Deformed eggs"
];

// دالة تغيير اللغة
function switchLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    const t = dictionary[currentLang];
    
    // 1. تغيير الاتجاه
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
    
    // 2. تغيير النصوص الثابتة
    document.getElementById('txt-logo').textContent = t.logo;
    document.getElementById('txt-nav').textContent = t.nav;
    document.getElementById('txt-new').textContent = t.new;
    langBtn.textContent = currentLang === 'ar' ? 'English' : 'عربي';
    
    document.getElementById('txt-hero-title').textContent = t.heroT;
    document.getElementById('txt-hero-desc').textContent = t.heroD;
    document.getElementById('txt-stat-1').textContent = t.stat1;
    document.getElementById('txt-stat-2').textContent = t.stat2;
    document.getElementById('txt-stat-3').textContent = t.stat3;
    
    document.getElementById('txt-upload-title').textContent = t.uploadT;
    document.getElementById('txt-upload-desc').textContent = t.uploadD;
    document.getElementById('txt-flock-title').textContent = t.flockT;
    
    document.getElementById('lbl-type').textContent = t.lblType;
    document.getElementById('lbl-age').textContent = t.lblAge;
    document.getElementById('lbl-count').textContent = t.lblCount;
    document.getElementById('lbl-mortality').textContent = t.lblMort;
    
    document.getElementById('flock-count').placeholder = t.phCount;
    document.getElementById('mortality-rate').placeholder = t.phMort;
    
    // خيارات القوائم
    document.getElementById('opt-type-def').textContent = t.optTypeDef;
    document.getElementById('opt-type-1').textContent = t.optType1;
    document.getElementById('opt-type-2').textContent = t.optType2;
    document.getElementById('opt-type-3').textContent = t.optType3;
    document.getElementById('opt-type-4').textContent = t.optType4;
    document.getElementById('opt-age-def').textContent = t.optAgeDef;

    document.getElementById('txt-symptoms-title').textContent = t.sympT;
    document.getElementById('txt-card-chicken').textContent = t.cardChk;
    document.getElementById('txt-hint-chicken').textContent = t.hintChk;
    document.getElementById('txt-card-other').textContent = t.cardOth;
    document.getElementById('txt-hint-other').textContent = t.hintOth;
    document.getElementById('txt-btn-add-organ').textContent = t.btnAdd;
    document.getElementById('txt-btn-analyze').textContent = t.btnAnlz;
    
    document.getElementById('txt-loading-title').textContent = t.loadT;
    document.getElementById('txt-loading-desc').textContent = t.loadD;
    document.getElementById('txt-res-title').textContent = t.resT;
    document.getElementById('txt-note-title').textContent = t.noteT;
    document.getElementById('txt-note-1').textContent = t.note1;
    document.getElementById('txt-note-2').textContent = t.note2;
    document.getElementById('txt-footer').textContent = t.foot;

    // إعادة رسم الأعراض
    renderSymptoms();
    
    // تحديث نصوص كروت الأعضاء الديناميكية الموجودة حالياً (إن وجدت)
    updateDynamicOrgansText(t);
}

function renderSymptoms() {
    const container = document.getElementById('symptomsChecklist');
    container.innerHTML = '';
    const list = currentLang === 'ar' ? symptomsAr : symptomsEn;
    
    list.forEach(symptom => {
        const label = document.createElement('label');
        label.className = 'checkbox-wrapper';
        label.innerHTML = `<input type="checkbox" value="${symptom}" class="symptom-checkbox"> ${symptom}`;
        container.appendChild(label);
    });
    
    // إعادة تفعيل listeners
    const checkboxes = document.querySelectorAll('.symptom-checkbox');
    checkboxes.forEach(box => {
        box.addEventListener('change', () => {
            selectedSymptoms = Array.from(checkboxes).filter(i => i.checked).map(i => i.value);
            checkAllInputsAndToggle();
        });
    });
}

function updateDynamicOrgansText(t) {
    document.querySelectorAll('.organ-card').forEach(card => {
        card.querySelector('h3').textContent = t.organHead;
        card.querySelector('label').textContent = t.organLbl;
        card.querySelector('.upload-area p').textContent = t.organHint;
        // تحديث خيارات القائمة داخل الكرت صعب قليلاً لذا سنكتفي بالعناوين الرئيسية
    });
}

langBtn.addEventListener('click', switchLanguage);
renderSymptoms(); // تشغيل أولي

// --- نهاية إعدادات اللغة ---

// مصفوفات الصور
let caseImages = { chicken: [], feces: [], organs: [] };
let selectedSymptoms = [];

function checkAllInputsAndToggle() {
    const hasSymptoms = selectedSymptoms.length > 0;
    const isTypeFilled = flockTypeInput.value !== "";
    const isAgeFilled = flockAgeInput.value !== "";
    const isCountFilled = flockCountInput.value.trim() !== "";
    const isMortalityFilled = mortalityInput.value.trim() !== "";

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

function handleMultiUpload(inputId, containerId, type) {
    const input = document.getElementById(inputId);
    const container = document.getElementById(containerId);
    if (!input) return;

    input.addEventListener('change', function (e) {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = function (event) {
                caseImages[type].push(event.target.result);
                const img = document.createElement('img');
                img.src = event.target.result;
                img.className = 'mini-preview-thumb';
                container.appendChild(img);
                const parentArea = container.parentElement;
                const icon = parentArea.querySelector('.upload-icon');
                const text = parentArea.querySelector('p');
                if(icon) icon.style.display = 'none';
                if(text) text.style.display = 'none';
                checkAnalyzeButton();
            };
            reader.readAsDataURL(file);
        });
    });
}

handleMultiUpload('input-chicken', 'preview-chicken-container', 'chicken');
handleMultiUpload('input-feces', 'preview-feces-container', 'feces');

// إنشاء كرت عضو ديناميكي مع دعم اللغة
function createNewOrganCard() {
    const t = dictionary[currentLang];
    const card = document.createElement('div');
    card.className = 'upload-card organ-card';
    
    // بناء قائمة الخيارات بناء على اللغة
    let optionsHtml = `<option value="" disabled selected>-- ${t.optTypeDef} --</option>`;
    for (const [key, value] of Object.entries(t.organList)) {
        optionsHtml += `<option value="${key}">${value}</option>`;
    }

    card.innerHTML = `
        <button class="remove-organ-btn" onclick="removeOrganCard(this)">×</button>
        <div class="upload-header">
            <i class="fas fa-microscope"></i>
            <h3>${t.organHead}</h3>
        </div>
        <div style="padding: 0 20px 15px;">
            <label style="display:block; margin-bottom:5px; font-size:0.9rem; color:#666;">${t.organLbl}</label>
            <select class="form-select organ-selector" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
                ${optionsHtml}
            </select>
        </div>
        <div class="upload-area" onclick="triggerOrganInput(this)">
            <div class="upload-icon"><i class="fas fa-camera"></i></div>
            <p>${t.organHint}</p>
            <div class="multi-preview-grid"></div>
        </div>
        <input type="file" accept="image/*" hidden onchange="processOrganFile(this)">
    `;
    
    dynamicOrgansArea.appendChild(card);
}

if(addOrganBtn) {
    addOrganBtn.addEventListener('click', createNewOrganCard);
}

window.triggerOrganInput = function(area) {
    const select = area.parentElement.querySelector('.organ-selector');
    if (select.value === "") {
        alert(currentLang === 'ar' ? "يرجى اختيار العضو أولاً" : "Please select organ first");
        select.focus();
    } else {
        area.parentElement.querySelector('input[type="file"]').click();
    }
}

window.processOrganFile = function(input) {
    const file = input.files[0];
    const card = input.parentElement;
    const type = card.querySelector('.organ-selector').value;
    const container = card.querySelector('.multi-preview-grid');
    const area = card.querySelector('.upload-area');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            caseImages.organs.push({ type: type, data: e.target.result });
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'mini-preview-thumb';
            container.appendChild(img);
            const icon = area.querySelector('.upload-icon');
            const text = area.querySelector('p');
            if(icon) icon.style.display = 'none';
            if(text) text.style.display = 'none';
            checkAnalyzeButton();
        };
        reader.readAsDataURL(file);
    }
}

window.removeOrganCard = function(btn) {
    btn.parentElement.remove();
    checkAnalyzeButton();
}

function checkAnalyzeButton() {
    const hasImages = caseImages.chicken.length > 0 || caseImages.feces.length > 0 || caseImages.organs.length > 0;
    if (analyzeBtn) analyzeBtn.disabled = !hasImages;
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
            alert("Error: " + error.message);
            if (loadingState) loadingState.style.display = 'none';
            analyzeBtn.disabled = false;
        }
    });
}

// دالة الإرسال مع دعم اللغة في الـ Prompt
async function getAnalysisFromGPT() {
    const flockType = flockTypeInput ? flockTypeInput.value : "Unknown";
    const flockAge = flockAgeInput ? flockAgeInput.value : "Unknown";
    const flockCount = flockCountInput ? flockCountInput.value : "Unknown";
    const mortality = mortalityInput ? mortalityInput.value : "Unknown";
    const historyText = selectedSymptoms.length > 0 ? selectedSymptoms.join(", ") : "None";

    // تحديد لغة الرد المطلوبة من GPT بناءً على اللغة الحالية
    const outputLangInstruction = currentLang === 'ar' 
        ? "Produce a JSON report strictly following this structure in ARABIC:" 
        : "Produce a JSON report strictly following this structure in ENGLISH:";

    const promptText = `
    Act as a highly experienced Poultry Veterinarian. Analyze attached images as ONE single case.
    Context: Flock: ${flockType}, Age: ${flockAge}, Size: ${flockCount}, Mortality: ${mortality}. Symptoms: ${historyText}.
    
    ${outputLangInstruction}
    {
        "1_chicken_type": { "value": "String", "reason": "String" },
        "2_weight_est": { "value": "String" },
        "3_age_est": { "value": "String" },
        "4_primary_diagnosis": { 
            "disease_name_ar": "String",
            "disease_name_en": "String",
            "probability": "String (e.g. '95%')",
            "diagnosis_summary": "String",
            "detailed_reasoning": {
                "head": "String", "balance": "String", "movement": "String", "eyes": "String", 
                "feathers": "String", "feces_color": "String", "feces_consistency": "String", 
                "feces_context": "String", "organ_analysis": "String"
            },
            "links": ["search_url"]
        },
        "5_alternatives": { 
            "diseases": [ { "name_ar": "String", "name_en": "String", "prob": "String", "reason": "String", "link": "url" } ] 
        },
        "6_treatment": { "isolation": "String", "feed_water": "String", "medication": "String", "environment": "String", "tests": "String", "link": "url" },
        "7_prevention": { "steps": "String", "link": "url" }
    }
    `;

    let contentArray = [{ type: "text", text: promptText }];
    caseImages.chicken.forEach(img => contentArray.push({ type: "image_url", image_url: { url: img } }));
    caseImages.feces.forEach(img => contentArray.push({ type: "image_url", image_url: { url: img } }));
    caseImages.organs.forEach(item => {
        contentArray.push({ type: "text", text: `Organ: ${item.type}` });
        contentArray.push({ type: "image_url", image_url: { url: item.data } });
    });

    const response = await fetch("/.netlify/functions/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [{ role: "user", content: contentArray }],
            response_format: { type: "json_object" },
            temperature: 0.2
        })
    });

    const data = await response.json();
    if (!data.choices) throw new Error("No response");
    return JSON.parse(data.choices[0].message.content);
}

function renderReport(data) {
    const t = dictionary[currentLang]; // استخدام القاموس لعناوين النتائج
    bitar.innerHTML = ''; 

    if (data.error) {
        bitar.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
        return;
    }

    createCard('fas fa-dna', t.flockT ? "Chicken Type" : "نوع الدجاجة", `
        <div style="padding: 10px;">
            <div style="display:flex; justify-content:space-between; background:#f9f9f9; padding:10px; border-radius:8px;">
                <strong>${currentLang==='ar'?'النوع:':'Type:'}</strong>
                <span style="color:#e65100; font-weight:bold;">${data["1_chicken_type"].value}</span>
            </div>
            <p style="margin-top:10px;">${data["1_chicken_type"].reason}</p>
        </div>
    `);

    createCard('fas fa-weight-hanging', currentLang==='ar'?'التقديرات':'Estimates', `
        <div style="display:flex; gap:10px;">
            <div style="flex:1; text-align:center; padding:10px; background:#f1f8e9; border-radius:10px;">
                <div style="font-weight:bold;">${data["2_weight_est"].value}</div>
                <small>${currentLang==='ar'?'الوزن':'Weight'}</small>
            </div>
            <div style="flex:1; text-align:center; padding:10px; background:#e3f2fd; border-radius:10px;">
                <div style="font-weight:bold;">${data["3_age_est"].value}</div>
                <small>${currentLang==='ar'?'العمر':'Age'}</small>
            </div>
        </div>
    `);

    const diag = data["4_primary_diagnosis"];
    const r = diag.detailed_reasoning;
    
    // عرض التفاصيل بناء على اللغة
    let detailsHtml = `<div style="margin-top:15px; background:#f8f9fa; padding:10px; border-radius:8px;">`;
    if(currentLang === 'ar') {
        detailsHtml += `<div><strong>الرأس:</strong> ${r.head}</div><div><strong>التوازن:</strong> ${r.balance}</div>`;
        if(r.organ_analysis) detailsHtml += `<div style="color:red; margin-top:5px;"><strong>التشريح:</strong> ${r.organ_analysis}</div>`;
    } else {
        detailsHtml += `<div><strong>Head:</strong> ${r.head}</div><div><strong>Balance:</strong> ${r.balance}</div>`;
        if(r.organ_analysis) detailsHtml += `<div style="color:red; margin-top:5px;"><strong>Anatomy:</strong> ${r.organ_analysis}</div>`;
    }
    detailsHtml += `</div>`;

    createCard('fas fa-user-md', currentLang==='ar'?'التشخيص الأساسي':'Primary Diagnosis', `
        <div style="padding: 10px;">
            <h2 style="color:#c62828; margin:0;">${currentLang === 'ar' ? diag.disease_name_ar : diag.disease_name_en}</h2>
            <h4 style="color:#777;">${currentLang === 'ar' ? diag.disease_name_en : diag.disease_name_ar}</h4>
            <div style="margin:10px 0;"><strong>${currentLang==='ar'?'الاشتباه:':'Confidence:'}</strong> ${diag.probability}</div>
            ${detailsHtml}
            <div style="margin-top:10px; background:#e3f2fd; padding:10px; border-radius:6px;">${diag.diagnosis_summary}</div>
        </div>
    `, true);

    const tr = data["6_treatment"];
    createCard('fas fa-pills', currentLang==='ar'?'العلاج':'Treatment', `
        <div><strong>${currentLang==='ar'?'العزل:':'Isolation:'}</strong> ${tr.isolation}</div>
        <div style="margin-top:5px;"><strong>${currentLang==='ar'?'الدواء:':'Meds:'}</strong> ${tr.medication}</div>
    `);
}

function createCard(icon, title, content, isOpen = false) {
    const card = document.createElement('div');
    card.className = `diagnosis-card ${isOpen ? 'active' : ''}`;
    card.innerHTML = `
        <div class="card-header">
            <div class="card-title"><i class="${icon}"></i> ${title}</div>
            <i class="fas fa-chevron-down toggle-icon"></i>
        </div>
        <div class="card-body">${content}</div>
    `;
    card.querySelector('.card-header').addEventListener('click', () => card.classList.toggle('active'));
    bitar.appendChild(card);
}
