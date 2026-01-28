/**
 * app.js - 
 */

const analyzeBtn = document.getElementById('analyzeBtn');
const loadingState = document.getElementById('loadingState');
const resultsSection = document.getElementById('resultsArea');
const bitar = document.getElementById('bitar');
const uploadGrid = document.getElementById('uploadGrid');
const addOrganBtn = document.getElementById('addOrganBtn');
const dynamicOrgansArea = document.getElementById('dynamic-organs-area');
const langBtn = document.getElementById('langBtn');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');


const flockTypeInput = document.getElementById('flock-type');
const flockAgeInput = document.getElementById('flock-age');
const flockCountInput = document.getElementById('flock-count');
const mortalityInput = document.getElementById('mortality-rate');


let currentLang = 'ar';

const dictionary = {
    ar: {
        logo: "أ.د. فراس الهياجنة", nav: "التحليل البيطري", new: "تشخيص جديد",
        heroT: "أ.د. فراس الهياجنة", heroD: "نظام متقدم يعتمد على الذكاء الاصطناعي لتشخيص أمراض الدواجن بدقة.",
        stat1: "نقاط تشخيصية", stat2: "دقة التحليل %", stat3: "ساعة خدمة",
        uploadT: "بيانات الحالة والصور", uploadD: "يرجى تعبئة البيانات ورفع كافة الصور المتاحة للدقة القصوى",
        flockT: "1. بيانات القطيع (إجباري لفتح الرفع):",
        lblType: "نوع القطيع:", lblAge: "العمر التقريبي:", lblCount: "العدد الكلي:", lblMort: "نسبة النفوق:",
        phCount: "مثال: 5000", phMort: "مثال: 50 طير أو 1%",
        sympT: "اختر الأعراض الملاحظة:",
        cardChk: "صور الدجاجة (المظهر)", hintChk: "اضغط لرفع صورة أو أكثر",
        cardOth: "صور إضافية / فضلات", hintOth: "اضغط لرفع صور إضافية",
        btnAdd: "إضافة عضو تشريحي آخر",
        btnAnlz: "بدء التحليل الشامل",
        loadT: "جاري تحليل جميع الصور...", loadD: "يقوم الذكاء الاصطناعي الآن بربط الأعراض بالصور المرفقة",
        resT: "التقرير الطبي المفصل",
        noteT: "تنويه هام", note1: "هذا النظام يستخدم أحدث تقنيات التكنولوجيا (Generative GPT).", 
        note2: "النتائج هي للاسترشاد الطبي ومطلوب مراجعتها من قبل مختص.",
        foot: "المحلل البيطري",
        optTypeDef: "-- اختر النوع --", optType1: "الجدات (Grandparents)", optType2: "الأمهات (Parents)", 
        optType3: "اللاحم (Broilers)", optType4: "البياض (Layers)",
        optAgeDef: "-- اختر العمر --",
        organHead: "عضو تشريحي إضافي", organLbl: "اختر العضو:", organHint: "اختر العضو ثم اضغط للرفع",
        organList: {
            "Liver": "الكبد (Liver)", "Intestine": "الأمعاء (Intestine)", "Heart": "القلب (Heart)", 
            "Gizzard": "القونصة (Gizzard)", "Lungs": "الرئتان (Lungs)", "Kidney": "الكلى (Kidney)", 
            "Spleen": "الطحال (Spleen)", "Brain": "الدماغ (Brain)", "Other": "عضو آخر"
        },
        rType: "النوع:", rReason: "سبب التصنيف:", 
        rEst: "التقديرات الحيوية", rWeight: "الوزن التقديري", rAge: "العمر التقديري",
        rDiag: "التشخيص الأساسي", rConf: "نسبة الاشتباه:", rSum: "💡 الخلاصة والربط بين الأعراض:", rRef: "المراجع:",
        rAlt: "التشخيص التفريقي (احتمالات أخرى)",
        rTreat: "خطة العلاج المتكاملة", rIso: "العزل:", rMeds: "الدواء:", rEnv: "البيئة:", rRead: "اقرأ المزيد",
        rPrev: "الوقاية",
        pdfTitle: "تقرير تشخيص بيطري", pdfDate: "تاريخ التقرير:", pdfInputs: "ملخص بيانات الحالة",
        pdfFooter: "تم إصدار هذا التقرير آلياً بواسطة نظام المحلل البيطري الذكي"
    },
    en: {
        logo: "POULTRY VET", nav: "Veterinary Analysis", new: "New Diagnosis",
        heroT: "PR FM HAYAJNEH", heroD: "Advanced system for accurate poultry disease diagnosis.",
        stat1: "Diagnostic Points", stat2: "Accuracy %", stat3: "Hours Service",
        uploadT: "Case Data & Images", uploadD: "Please fill in the data and upload all available images for maximum accuracy",
        flockT: "1. Flock Data (Required to unlock upload):",
        lblType: "Flock Type:", lblAge: "Approx. Age:", lblCount: "Total Count:", lblMort: "Mortality Rate:",
        phCount: "e.g: 5000", phMort: "e.g: 1%",
        sympT: "Observed Symptoms:",
        cardChk: "Chicken Images (Appearance)", hintChk: "Click to upload images",
        cardOth: "Extra Images / Feces", hintOth: "Click to upload extra images",
        btnAdd: "Add Another Organ",
        btnAnlz: "Start Comprehensive Analysis",
        loadT: "Analyzing all images...", loadD: "AI is now correlating symptoms with the uploaded images",
        resT: "Detailed Medical Report",
        noteT: "Important Disclaimer", note1: "This system uses Generative AI technology.", 
        note2: "Results are for guidance only and require professional review.",
        foot: "Vet Analyst",
        optTypeDef: "-- Select Type --", optType1: "Grandparents", optType2: "Parents", 
        optType3: "Broilers", optType4: "Layers",
        optAgeDef: "-- Select Age --",
        organHead: "Additional Anatomical Organ", organLbl: "Select Organ:", organHint: "Select organ then click to upload",
        organList: {
            "Liver": "Liver", "Intestine": "Intestine", "Heart": "Heart", 
            "Gizzard": "Gizzard", "Lungs": "Lungs", "Kidney": "Kidney", 
            "Spleen": "Spleen", "Brain": "Brain", "Other": "Other"
        },
        rType: "Type:", rReason: "Reasoning:", 
        rEst: "Vital Estimates", rWeight: "Est. Weight", rAge: "Est. Age",
        rDiag: "Primary Diagnosis", rConf: "Confidence:", rSum: "💡 Summary & Correlation:", rRef: "References:",
        rAlt: "Differential Diagnosis (Alternatives)",
        rTreat: "Treatment Protocol", rIso: "Isolation:", rMeds: "Meds:", rEnv: "Env:", rRead: "Read More",
        rPrev: "Prevention",
        pdfTitle: "Veterinary Diagnosis Report", pdfDate: "Report Date:", pdfInputs: "Case Data Summary",
        pdfFooter: "Generated automatically by Smart Vet Analyst System"
    }
};

const symptomsAr = [
    "فقدان الشهية", "نقص استهلاك العلف والماء", "الهزال ونقص الوزن", "انتفاش الريش",
    "زيادة النفوق أو نفوق مفاجئ", "صعوبة أو تسارع التنفس", "التنفس بفم مفتوح",
    "إفرازات أنفية أو عينية", "تورم الوجه أو الجيوب الأنفية", "شحوب أو ازرقاق العرف والدلايات",
    "إسهال (مائي، أخضر، أبيض، دموي)", "اتساخ منطقة المجمع", "بطء النمو وسوء التحويل الغذائي",
    "عدم الاتزان أو العرج", "شلل الأجنحة أو الأرجل", "التواء الرقبة أو أعراض عصبية",
    "تورم المفاصل أو صعوبة الحركة", "انخفاض أو توقف إنتاج البيض", "بيض مشوه أو رقيق القشرة"
];

const symptomsEn = [
    "Loss of appetite", "Reduced feed/water intake", "Emaciation/Weight loss", "Ruffled feathers",
    "Increased/Sudden mortality", "Difficulty/Rapid breathing", "Gasping/Open mouth breathing",
    "Nasal/Ocular discharge", "Swollen face/sinuses", "Pale or cyanotic comb/wattles",
    "Diarrhea (watery, green, white, bloody)", "Dirty vent area", "Stunted growth/Poor FCR",
    "Imbalance/Lameness", "Paralysis of wings/legs", "Twisted neck (Torticollis)/Nervous signs",
    "Swollen joints/Reluctance to move", "Drop/Cessation in egg production", "Deformed/Thin-shelled eggs"
];

// دالة تغيير اللغة
function switchLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    const t = dictionary[currentLang];
    
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
    
    updateElementText('txt-logo', t.logo);
    updateElementText('txt-nav', t.nav);
    updateElementText('txt-new', t.new);
    langBtn.textContent = currentLang === 'ar' ? 'English' : 'عربي';
    
    updateElementText('txt-hero-title', t.heroT);
    updateElementText('txt-hero-desc', t.heroD);
    updateElementText('txt-stat-1', t.stat1);
    updateElementText('txt-stat-2', t.stat2);
    updateElementText('txt-stat-3', t.stat3);
    
    updateElementText('txt-upload-title', t.uploadT);
    updateElementText('txt-upload-desc', t.uploadD);
    updateElementText('txt-flock-title', t.flockT);
    
    updateElementText('lbl-type', t.lblType);
    updateElementText('lbl-age', t.lblAge);
    updateElementText('lbl-count', t.lblCount);
    updateElementText('lbl-mortality', t.lblMort);
    
    if(flockCountInput) flockCountInput.placeholder = t.phCount;
    if(mortalityInput) mortalityInput.placeholder = t.phMort;
    
    updateElementText('opt-type-def', t.optTypeDef);
    updateElementText('opt-type-1', t.optType1);
    updateElementText('opt-type-2', t.optType2);
    updateElementText('opt-type-3', t.optType3);
    updateElementText('opt-type-4', t.optType4);
    updateElementText('opt-age-def', t.optAgeDef);

    updateElementText('txt-symptoms-title', t.sympT);
    updateElementText('txt-card-chicken', t.cardChk);
    updateElementText('txt-hint-chicken', t.hintChk);
    updateElementText('txt-card-other', t.cardOth);
    updateElementText('txt-hint-other', t.hintOth);
    updateElementText('txt-btn-add-organ', t.btnAdd);
    updateElementText('txt-btn-analyze', t.btnAnlz);
    
    updateElementText('txt-loading-title', t.loadT);
    updateElementText('txt-loading-desc', t.loadD);
    updateElementText('txt-res-title', t.resT);
    updateElementText('txt-note-title', t.noteT);
    updateElementText('txt-note-1', t.note1);
    updateElementText('txt-note-2', t.note2);
    updateElementText('txt-footer', t.foot);

    renderSymptoms();
    updateDynamicOrgansText(t);
}

function updateElementText(id, text) {
    const el = document.getElementById(id);
    if(el) el.textContent = text;
}

function renderSymptoms() {
    const container = document.getElementById('symptomsChecklist');
    if(!container) return;
    container.innerHTML = '';
    
    const list = currentLang === 'ar' ? symptomsAr : symptomsEn;
    
    list.forEach(symptom => {
        const label = document.createElement('label');
        label.className = 'checkbox-wrapper';
        label.innerHTML = `<input type="checkbox" value="${symptom}" class="symptom-checkbox"> ${symptom}`;
        container.appendChild(label);
    });
    
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
        const title = card.querySelector('h3');
        if(title) title.textContent = t.organHead;
        
        const label = card.querySelector('label');
        if(label) label.textContent = t.organLbl;
        
        const p = card.querySelector('.upload-area p');
        if(p) p.textContent = t.organHint;
        
        const select = card.querySelector('select');
        if(select && select.options.length > 0) {
            select.options[0].text = t.optOrganDefault || "-- القائمة --";
        }
    });
}

if(langBtn) {
    langBtn.addEventListener('click', switchLanguage);
}

renderSymptoms();

// --- منطق الصور المتعددة والمصفوفات ---
let caseImages = {
    chicken: [],
    feces: [],
    organs: [] 
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

function createNewOrganCard() {
    const t = dictionary[currentLang];
    const card = document.createElement('div');
    card.className = 'upload-card organ-card';
    
    let optionsHtml = `<option value="" disabled selected>${t.optTypeDef || "-- القائمة --"}</option>`;
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
    const t = dictionary[currentLang];
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

// --- دالة إنشاء PDF الاحترافي (المعدلة لإضافة العنصر للصفحة) ---
if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', generateProfessionalPDF);
}

function generateProfessionalPDF() {
    const t = dictionary[currentLang];
    
    // 1. إنشاء العنصر وإضافته للصفحة
    const element = document.createElement('div');
    element.id = 'temp-pdf-container';
    
    // إخفاء العنصر عن المستخدم لكن إبقاءه متاحاً للطباعة
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.top = '0';
    element.style.width = '800px'; 
    element.style.direction = currentLang === 'ar' ? 'rtl' : 'ltr';
    element.style.fontFamily = "'Tajawal', sans-serif";
    element.style.padding = '20px';
    element.style.background = '#ffffff';
    element.style.color = '#333';

    // 2. تجميع البيانات
    const date = new Date().toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US');
    const flockInfo = `
        <div style="background:#f8f9fa; border:1px solid #ddd; border-radius:10px; padding:15px; margin-bottom:20px;">
            <h3 style="color:#4361ee; margin-top:0; border-bottom:1px solid #eee; padding-bottom:10px;">${t.pdfInputs}</h3>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; font-size:0.9rem;">
                <div><strong>${t.lblType}</strong> ${flockTypeInput.value}</div>
                <div><strong>${t.lblAge}</strong> ${flockAgeInput.value}</div>
                <div><strong>${t.lblCount}</strong> ${flockCountInput.value}</div>
                <div><strong>${t.lblMort}</strong> ${mortalityInput.value}</div>
            </div>
            <div style="margin-top:10px;">
                <strong>${t.sympT}</strong> <br>
                <span style="color:#666; font-size:0.85rem;">${selectedSymptoms.join(', ')}</span>
            </div>
        </div>
    `;

    // 3. نسخ المحتوى
    const resultsContent = document.getElementById('bitar').innerHTML;

    element.innerHTML = `
        <div style="text-align:center; margin-bottom:30px; border-bottom: 2px solid #4361ee; padding-bottom: 20px;">
            <h1 style="color:#4361ee; margin:0;">${t.logo}</h1>
            <h3 style="color:#666; margin:5px;">${t.pdfTitle}</h3>
            <p style="font-size:0.9rem; color:#888;">${t.pdfDate} ${date}</p>
        </div>
        
        ${flockInfo}
        
        <div class="pdf-content-body">
            ${resultsContent}
        </div>

        <div style="text-align:center; margin-top:50px; border-top:1px solid #eee; padding-top:15px; font-size:0.8rem; color:#888;">
            ${t.pdfFooter}
        </div>
    `;

    // 4. إضافة العنصر للصفحة فعلياً
    document.body.appendChild(element);

    // 5. التحويل والحفظ ثم الإزالة
    const opt = {
        margin:       [0.5, 0.5],
        filename:     `Vet-Report-${Date.now()}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        document.body.removeChild(element); // تنظيف بعد التحميل
    });
}

async function getAnalysisFromGPT() {
    const flockType = flockTypeInput ? flockTypeInput.value : "Unknown";
    const flockAge = flockAgeInput ? flockAgeInput.value : "Unknown";
    const flockCount = flockCountInput ? flockCountInput.value : "Unknown";
    const mortality = mortalityInput ? mortalityInput.value : "Unknown";
    const historyText = selectedSymptoms.length > 0 ? selectedSymptoms.join(", ") : "No specific history provided";

    const outputLangInstruction = currentLang === 'ar' 
        ? "IMPORTANT: Provide all string values inside the JSON in ARABIC language." 
        : "IMPORTANT: Provide all string values inside the JSON in ENGLISH language.";

    const promptText = `
    Act as a highly experienced Poultry Veterinarian and Pathologist. Analyze the attached images combined as a SINGLE CASE.
    
    Context Provided:
    - **Flock Data:** Type: ${flockType}, Age: ${flockAge}, Size: ${flockCount}, Mortality: ${mortality}
    - **Clinical History / Symptoms Reported:** ${historyText}
    
    Images Provided:
    The user has uploaded multiple images. Analyze them in this priority:
    1. **Organs (Pathology):** Look for Necrosis, Enlargement, Color changes (Pale/Dark), Fibrin, Hemorrhages.
    2. **External Appearance:** Look for Head position (Torticollis), Eyes, Feathers, Legs (Dehydration).
    3. **Feces:** Look for Color (Green/White/Bloody) and Consistency.
    
    CRITICAL INSTRUCTIONS:
    1. **Correlate findings:** Connect the external symptoms with the internal organ lesions.
    2. **Probability:** MUST be a percentage (e.g., '95%').
    3. **Precision:** Use medical terms (e.g., "Petechial hemorrhage", "Hepatomegaly") then explain them simply.
    
    ${outputLangInstruction}
    
    Produce a JSON report strictly following this structure:
    {
        "1_chicken_type": { "title": "Type", "value": "String", "reason": "String" },
        "2_weight_est": { "title": "Weight", "value": "String" },
        "3_age_est": { "title": "Age", "value": "String" },
        "4_primary_diagnosis": { 
            "disease_name_ar": "String (Arabic Name)",
            "disease_name_en": "String (English Name)",
            "probability": "String (e.g. '95%')",
            "diagnosis_summary": "String",
            "detailed_reasoning": {
                "head": "String", "balance": "String", "movement": "String", "eyes": "String",
                "feathers": "String", "feces_color": "String", "feces_consistency": "String",
                "feces_context": "String", "organ_analysis": "String"
            },
            "links": ["https://www.google.com/search?q=DISEASE_NAME_EN+symptoms+poultry"]
        },
        "5_alternatives": { 
            "diseases": [ { "name_ar": "String", "name_en": "String", "prob": "String", "reason": "String", "link": "https://www.google.com/search?q=DISEASE_NAME_EN+poultry" } ] 
        },
        "6_treatment": { "isolation": "String", "feed_water": "String", "medication": "String", "environment": "String", "tests": "String", "link": "https://www.google.com/search?q=DISEASE_NAME_EN+treatment+protocol+poultry" },
        "7_prevention": { "steps": "String", "link": "String" }
    }
    If images are unrelated to poultry, return error JSON.
    `;

    let contentArray = [{ type: "text", text: promptText }];

    caseImages.chicken.forEach(img => {
        contentArray.push({ type: "image_url", image_url: { url: img } });
    });

    caseImages.feces.forEach(img => {
        contentArray.push({ type: "image_url", image_url: { url: img } });
    });

    caseImages.organs.forEach(item => {
        contentArray.push({ type: "text", text: `High resolution image of organ: ${item.type}` });
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
    if (!data.choices || !data.choices[0].message.content) throw new Error("No response from AI");
    return JSON.parse(data.choices[0].message.content);
}

function renderReport(data) {
    const t = dictionary[currentLang];
    bitar.innerHTML = ''; 

    if (data.error) {
        bitar.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
        return;
    }

    createCard('fas fa-dna', t.rType ? t.rType : 'النوع:', `
        <div style="padding: 5px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap: 10px; margin-bottom: 10px;">
                <strong style="font-size:1.2rem; color:#333;">${currentLang === 'ar' ? 'النوع:' : 'Type:'}</strong> 
                <span style="font-size:1.2rem; font-weight:800; color:#e65100; background:#fff3e0; padding:2px 10px; border-radius:4px;">
                    ${data["1_chicken_type"].value}
                </span>
            </div>
            <div class="reason-highlight" style="background:#f9f9f9; padding:10px; border-radius:8px; border-right:4px solid #e65100;">
                <strong style="color:#555;">${t.rReason}</strong> 
                <span style="color:#666;">${data["1_chicken_type"].reason}</span>
            </div>
        </div>
    `);

    createCard('fas fa-weight-hanging', t.rEst, `
        <div style="display:flex; gap:15px; flex-wrap: wrap;">
            <div style="flex:1; background:#f9f9f9; border-radius:10px; padding:12px; display:flex; align-items:center; gap:15px; border:1px solid #eee;">
                <div style="background:#e8eaf6; color:#3949ab; width:50px; height:50px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.4rem;"><i class="fas fa-weight"></i></div>
                <div><div style="font-weight:800; font-size:1.2rem; color:#333; margin-bottom:4px;">${data["2_weight_est"].value}</div><div style="font-size:0.9rem; color:#666; font-weight:bold;">${t.rWeight}</div></div>
            </div>
            <div style="flex:1; background:#f9f9f9; border-radius:10px; padding:12px; display:flex; align-items:center; gap:15px; border:1px solid #eee;">
                <div style="background:#e8eaf6; color:#3949ab; width:50px; height:50px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.4rem;"><i class="fas fa-clock"></i></div>
                <div><div style="font-weight:800; font-size:1.2rem; color:#333; margin-bottom:4px;">${data["3_age_est"].value}</div><div style="font-size:0.9rem; color:#666; font-weight:bold;">${t.rAge}</div></div>
            </div>
        </div>
    `);

   let linksHtml = data["4_primary_diagnosis"].links.map(l => `<a href="${l}" target="_blank" style="color:#b78a00; text-decoration:underline;">${t.rRead}</a>`).join(' | ');
    const reasons = data["4_primary_diagnosis"].detailed_reasoning;
    
    let fecesHtml = '';
    if (reasons.feces_color && reasons.feces_color !== 'N/A') {
        fecesHtml = `
        <div style="margin-top:15px; border-top:1px dashed #ccc; padding-top:15px;">
            <h6 style="color:#795548; margin-bottom:10px; font-weight:bold; display:flex; align-items:center; gap:5px;"><i class="fas fa-flask"></i> ${currentLang === 'ar' ? 'تحليل البراز' : 'Feces Analysis'}:</h6>
            <div style="margin-bottom:5px; display:flex; gap:5px;"><strong style="color:#5d4037; min-width:90px;"> ${t.res_color || 'اللون'}:</strong> <span style="color:#555;">${reasons.feces_color}</span></div>
            <div style="margin-bottom:5px; display:flex; gap:5px;"><strong style="color:#5d4037; min-width:90px;"> ${t.res_consist || 'القوام'}:</strong> <span style="color:#555;">${reasons.feces_consistency}</span></div>
        </div>`;
    }

    let organHtml = '';
    if (reasons.organ_analysis && reasons.organ_analysis !== 'N/A') {
        organHtml = `
        <div style="margin-top:15px; border-top:1px dashed #ccc; padding-top:15px;">
            <h6 style="color:#c62828; margin-bottom:10px; font-weight:bold; display:flex; align-items:center; gap:5px;"><i class="fas fa-heartbeat"></i> ${t.res_organ_analysis || 'الفحص التشريحي'}:</h6>
            <div style="color:#444; font-size:0.95rem; line-height:1.6; padding-right:10px;">${reasons.organ_analysis}</div>
        </div>`;
    }

    const symptomsHtml = `
        <div style="margin-top:15px; background:#f8f9fa; border:1px solid #e9ecef; border-radius:8px; padding:15px;">
            <h5 style="color:#3949ab; margin-bottom:10px; font-weight:bold; display:flex; align-items:center; gap:5px;"><i class="fas fa-dove"></i> ${t.res_ext_analysis || 'التحليل الظاهري'}:</h5>
            <div style="padding-right:10px;">
                <div style="margin-bottom:8px; display:flex; gap:5px;"><strong style="color:#333; min-width:90px;"> ${t.res_head || 'الرأس'}:</strong> <span style="color:#555;">${reasons.head}</span></div>
                <div style="margin-bottom:8px; display:flex; gap:5px;"><strong style="color:#333; min-width:90px;"> ${t.res_bal || 'التوازن'}:</strong> <span style="color:#555;">${reasons.balance}</span></div>
                <div style="margin-bottom:8px; display:flex; gap:5px;"><strong style="color:#333; min-width:90px;"> ${t.res_move || 'الحركة'}:</strong> <span style="color:#555;">${reasons.movement}</span></div>
                <div style="display:flex; gap:5px;"><strong style="color:#333; min-width:90px;"> ${t.res_feathers || 'الريش'}:</strong> <span style="color:#555;">${reasons.feathers}</span></div>
            </div>
            ${fecesHtml}
            ${organHtml}
        </div>
    `;

    createCard('fas fa-user-md', t.rDiag, `
        <div style="padding: 5px;">
            <div style="margin-bottom: 15px;">
                <h3 style="color:#c62828; margin:0 0 5px 0; font-weight:900; font-size:1.6rem; line-height:1.2;">${currentLang==='ar'?data["4_primary_diagnosis"].disease_name_ar:data["4_primary_diagnosis"].disease_name_en}</h3>
                <h4 style="color:#555; font-weight:bold; margin:0; font-family:sans-serif; font-size:1.1rem;">${currentLang==='ar'?data["4_primary_diagnosis"].disease_name_en:data["4_primary_diagnosis"].disease_name_ar}</h4>
            </div>
            <div style="display:flex; align-items:center; gap: 10px; margin-bottom: 20px;">
                <strong style="color:#333; font-size:1.1rem;">${t.rConf}</strong> 
                <span style="background:#ffebee; color:#c62828; padding:4px 15px; border-radius:6px; font-weight:900; font-size:1.3rem; border:1px solid #ffcdd2;">${data["4_primary_diagnosis"].probability}</span>
            </div>
            ${symptomsHtml}
            <div style="margin-top:15px; background:#e3f2fd; padding:12px; border-radius:6px; border-right:4px solid #2196f3;">
                <strong style="color:#0d47a1; display:block; margin-bottom:5px;">${t.rSum}</strong>
                <p style="margin:0; color:#333; font-size:0.95rem; line-height:1.6;">${data["4_primary_diagnosis"].diagnosis_summary}</p>
            </div>
            <div class="source-box"><i class="fas fa-link"></i> ${t.rRef} ${linksHtml}</div>
        </div>
    `, true);

   let altHtml = '<ul style="list-style:none; padding:0; margin:0;">';
    data["5_alternatives"].diseases.forEach(d => {
        altHtml += `
        <li style="background:#fff; border:1px solid #eee; border-radius:12px; padding:15px; margin-bottom:12px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); transition: transform 0.2s;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <div><div style="font-weight:900; font-size:1.1rem; color:#2c3e50;">${currentLang==='ar'?d.name_ar:d.name_en}</div><div style="font-size:0.85rem; color:#95a5a6; font-family:sans-serif;">${currentLang==='ar'?d.name_en:d.name_ar}</div></div>
                <span style="background:#e3f2fd; color:#1565c0; padding:5px 12px; border-radius:8px; font-weight:900; font-size:1rem; border:1px solid #bbdefb;">${d.prob}</span>
            </div>
            <div style="font-size:0.95rem; color:#555; margin-bottom:10px; padding-right:10px; border-right:3px solid #cfd8dc; line-height:1.5;"><strong style="color:#455a64;">${currentLang==='ar'?'السبب:':'Reason:'}</strong> ${d.reason}</div>
            <div style="text-align:left;"><a href="${d.link}" target="_blank" style="font-size:0.85rem; color:#3949ab; text-decoration:none; font-weight:bold; display:inline-flex; align-items:center; gap:5px;"><i class="fas fa-external-link-alt"></i> ${t.rRead}</a></div>
        </li>`;
    });
    altHtml += '</ul>';
    createCard('fas fa-list-ol', t.rAlt, altHtml);

    const tr = data["6_treatment"];
    const trHtml = `
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="background:#fff; border:1px solid #ffcdd2; border-radius:10px; padding:15px;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;"><div style="background:#ffebee; color:#c62828; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.1rem;"><i class="fas fa-door-closed"></i></div><strong style="font-size:1.1rem; color:#c62828;">${t.rIso}</strong></div>
                <div style="color:#555; line-height:1.6; padding-right:46px;">${tr.isolation}</div>
            </div>
            <div style="background:#fdf2ff; border:1px solid #e1bee7; border-radius:10px; padding:15px;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;"><div style="background:#fff; color:#8e24aa; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.1rem; border:1px solid #ba68c8;"><i class="fas fa-prescription-bottle-alt"></i></div><strong style="font-size:1.1rem; color:#7b1fa2;">${t.rMeds}</strong></div>
                <div style="color:#333; font-weight:bold; line-height:1.6; padding-right:46px;">${tr.medication}</div>
            </div>
            <div style="background:#fff; border:1px solid #c8e6c9; border-radius:10px; padding:15px;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;"><div style="background:#e8f5e9; color:#2e7d32; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.1rem;"><i class="fas fa-temperature-high"></i></div><strong style="font-size:1.1rem; color:#2e7d32;">${t.rEnv}</strong></div>
                <div style="color:#555; line-height:1.6; padding-right:46px;">${tr.environment}</div>
            </div>
        </div>
    `;

    createCard('fas fa-pills', t.rTreat, `${trHtml}<div style="margin-top:15px; text-align:left;"><a href="${tr.link}" target="_blank" style="background:#3949ab; color:#fff; padding:8px 15px; border-radius:6px; text-decoration:none; font-size:0.9rem; display:inline-flex; align-items:center; gap:5px;"><i class="fas fa-external-link-alt"></i> ${t.rRead} </a></div>`);

   createCard('fas fa-shield-alt', t.rPrev, `
        <div style="white-space: pre-line; line-height:1.8; color:#333;">${data["7_prevention"].steps}</div>
        <div class="source-box"><a href="${data["7_prevention"].link}" target="_blank">🔗 ${t.rRead} </a></div>
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


