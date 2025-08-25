import React, { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithCustomToken,
  onAuthStateChanged,
  signInAnonymously,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import * as Recharts from "recharts";

// --- بيانات الكلمات الكاملة من قائمة أكسفورد ---
// ملاحظة: تم تحديث هذه القائمة بناءً على الملفات المرفقة.
const OXFORD_DATA = {
  A1: [
    {
      english: "word",
      arabic: "كلمة",
      sentence: "I learn a new word every day.",
      sentenceArabic: "أتعلم كلمة جديدة كل يوم.",
    },
    {
      english: "terminal",
      arabic: "محطة",
      sentence: "I will meet you at the bus terminal.",
      sentenceArabic: "سأقابلك في محطة الحافلات.",
    },
    {
      english: "match",
      arabic: "مباراة",
      sentence: "We watched a football match on TV.",
      sentenceArabic: "شاهدنا مباراة كرة قدم على التلفاز.",
    },
    {
      english: "light",
      arabic: "ضوء",
      sentence: "Turn on the light, please.",
      sentenceArabic: "شغل الضوء من فضلك.",
    },
    {
      english: "second",
      arabic: "ثانية",
      sentence: "Wait a second, please.",
      sentenceArabic: "انتظر ثانية من فضلك.",
    },
    {
      english: "like",
      arabic: "يحب",
      sentence: "I like to eat pizza.",
      sentenceArabic: "أنا أحب أكل البيتزا.",
    },
    {
      english: "double",
      arabic: "مزدوج",
      sentence: "We booked a double room.",
      sentenceArabic: "حجزنا غرفة مزدوجة.",
    },
    {
      english: "August",
      arabic: "أغسطس",
      sentence: "My birthday is in August.",
      sentenceArabic: "عيد ميلادي في أغسطس.",
    },
    {
      english: "aunt",
      arabic: "عمة",
      sentence: "My aunt makes delicious cakes.",
      sentenceArabic: "عمتي تصنع كعكات لذيذة.",
    },
    {
      english: "autumn",
      arabic: "خريف",
      sentence: "The leaves fall in autumn.",
      sentenceArabic: "تتساقط الأوراق في الخريف.",
    },
    {
      english: "away",
      arabic: "بعيد",
      sentence: "The school is away from my house.",
      sentenceArabic: "المدرسة بعيدة عن بيتي.",
    },
    {
      english: "baby",
      arabic: "طفل",
      sentence: "The baby is sleeping.",
      sentenceArabic: "الطفل نائم.",
    },
    {
      english: "bad",
      arabic: "سيء",
      sentence: "The weather is bad today.",
      sentenceArabic: "الطقس سيء اليوم.",
    },
    {
      english: "bag",
      arabic: "حقيبة",
      sentence: "I put my books in my bag.",
      sentenceArabic: "أضع كتبي في حقيبتي.",
    },
    {
      english: "ball",
      arabic: "كرة",
      sentence: "The children play with a ball.",
      sentenceArabic: "الأطفال يلعبون بالكرة.",
    },
    {
      english: "banana",
      arabic: "موز",
      sentence: "I eat a banana every morning.",
      sentenceArabic: "آكل موزة كل صباح.",
    },
    {
      english: "band",
      arabic: "فرقة",
      sentence: "My brother plays in a band.",
      sentenceArabic: "أخي يعزف في فرقة.",
    },
    {
      english: "bank",
      arabic: "بنك",
      sentence: "I need to go to the bank.",
      sentenceArabic: "أحتاج أن أذهب إلى البنك.",
    },
    {
      english: "bath",
      arabic: "حمام",
      sentence: "I take a bath every day.",
      sentenceArabic: "أستحم كل يوم.",
    },
    {
      english: "bathroom",
      arabic: "حمام",
      sentence: "The bathroom is clean.",
      sentenceArabic: "الحمام نظيف.",
    },
    {
      english: "be",
      arabic: "يكون",
      sentence: "I want to be a doctor.",
      sentenceArabic: "أريد أن أصبح طبيباً.",
    },
    {
      english: "beach",
      arabic: "شاطئ",
      sentence: "We go to the beach in summer.",
      sentenceArabic: "نذهب إلى الشاطئ في الصيف.",
    },
    {
      english: "beautiful",
      arabic: "جميل",
      sentence: "She has a beautiful voice.",
      sentenceArabic: "لديها صوت جميل.",
    },
    {
      english: "because",
      arabic: "لأن",
      sentence: "I am happy because I passed the exam.",
      sentenceArabic: "أنا سعيد لأنني نجحت في الامتحان.",
    },
    {
      english: "become",
      arabic: "أصبح",
      sentence: "He wants to become a teacher.",
      sentenceArabic: "هو يريد أن يصبح مدرساً.",
    },
    {
      english: "bed",
      arabic: "سرير",
      sentence: "I go to bed at 10 o'clock.",
      sentenceArabic: "أذهب إلى السرير في الساعة العاشرة.",
    },
    {
      english: "bedroom",
      arabic: "غرفة نوم",
      sentence: "My bedroom is small but comfortable.",
      sentenceArabic: "غرفة نومي صغيرة ولكن مريحة.",
    },
    {
      english: "beer",
      arabic: "بيرة",
      sentence: "My father drinks beer sometimes.",
      sentenceArabic: "والدي يشرب البيرة أحياناً.",
    },
    {
      english: "thousand",
      arabic: "ألف",
      sentence: "This book costs five thousand dollars.",
      sentenceArabic: "هذا الكتاب يكلف خمسة آلاف دولار.",
    },
    {
      english: "three",
      arabic: "ثلاثة",
      sentence: "I have three brothers.",
      sentenceArabic: "لدي ثلاثة إخوة.",
    },
    {
      english: "through",
      arabic: "خلال",
      sentence: "We walked through the park.",
      sentenceArabic: "مشينا خلال الحديقة.",
    },
    {
      english: "Thursday",
      arabic: "الخميس",
      sentence: "We have a test on Thursday.",
      sentenceArabic: "لدينا اختبار يوم الخميس.",
    },
    {
      english: "ticket",
      arabic: "تذكرة",
      sentence: "I bought a ticket for the concert.",
      sentenceArabic: "اشتريت تذكرة للحفل.",
    },
    {
      english: "tired",
      arabic: "متعب",
      sentence: "I am tired after work.",
      sentenceArabic: "أنا متعب بعد العمل.",
    },
    {
      english: "to",
      arabic: "إلى",
      sentence: "I go to school every day.",
      sentenceArabic: "أذهب إلى المدرسة كل يوم.",
    },
    {
      english: "today",
      arabic: "اليوم",
      sentence: "Today is a sunny day.",
      sentenceArabic: "اليوم يوم مشمس.",
    },
    {
      english: "together",
      arabic: "معاً",
      sentence: "We study together.",
      sentenceArabic: "نحن ندرس معاً.",
    },
    {
      english: "toilet",
      arabic: "مرحاض",
      sentence: "Where is the toilet?",
      sentenceArabic: "أين المرحاض؟",
    },
    {
      english: "tomato",
      arabic: "طماطم",
      sentence: "I need tomatoes for the salad.",
      sentenceArabic: "أحتاج طماطم للسلطة.",
    },
    {
      english: "tomorrow",
      arabic: "غداً",
      sentence: "We will go to the beach tomorrow.",
      sentenceArabic: "سنذهب إلى الشاطئ غداً.",
    },
    {
      english: "tonight",
      arabic: "الليلة",
      sentence: "I will watch a movie tonight.",
      sentenceArabic: "سأشاهد فيلماً الليلة.",
    },
    {
      english: "too",
      arabic: "أيضاً",
      sentence: "I like coffee too.",
      sentenceArabic: "أنا أحب القهوة أيضاً.",
    },
    {
      english: "tooth",
      arabic: "سن",
      sentence: "I have a toothache.",
      sentenceArabic: "أعاني من ألم في السن.",
    },
    {
      english: "topic",
      arabic: "موضوع",
      sentence: "Our topic today is about animals.",
      sentenceArabic: "موضوعنا اليوم عن الحيوانات.",
    },
    {
      english: "tourist",
      arabic: "سائح",
      sentence: "Many tourists visit this city.",
      sentenceArabic: "الكثير من السياح يزورون هذه المدينة.",
    },
    {
      english: "town",
      arabic: "مدينة",
      sentence: "I live in a small town.",
      sentenceArabic: "أعيش في مدينة صغيرة.",
    },
    {
      english: "traffic",
      arabic: "مرور",
      sentence: "There is a lot of traffic in the morning.",
      sentenceArabic: "هناك الكثير من المرور في الصباح.",
    },
    {
      english: "travel",
      arabic: "سفر",
      sentence: "I love to travel to new countries.",
      sentenceArabic: "أحب السفر إلى بلدان جديدة.",
    },
    {
      english: "tree",
      arabic: "شجرة",
      sentence: "There is a big tree in our garden.",
      sentenceArabic: "هناك شجرة كبيرة في حديقتنا.",
    },
    {
      english: "window",
      arabic: "نافذة",
      sentence: "Open the window, please.",
      sentenceArabic: "افتح النافذة من فضلك.",
    },
    {
      english: "wine",
      arabic: "نبيذ",
      sentence: "We drank red wine with dinner.",
      sentenceArabic: "شربنا نبيذ أحمر مع العشاء.",
    },
    {
      english: "winter",
      arabic: "شتاء",
      sentence: "It snows in winter.",
      sentenceArabic: "تتساقط الثلوج في الشتاء.",
    },
    {
      english: "with",
      arabic: "مع",
      sentence: "I go to school with my friend.",
      sentenceArabic: "أذهب إلى المدرسة مع صديقي.",
    },
    {
      english: "without",
      arabic: "بدون",
      sentence: "I drink tea without sugar.",
      sentenceArabic: "أشرب الشاي بدون سكر.",
    },
    {
      english: "woman",
      arabic: "امرأة",
      sentence: "That woman is my teacher.",
      sentenceArabic: "تلك المرأة هي معلمتي.",
    },
    {
      english: "wonderful",
      arabic: "رائع",
      sentence: "We had a wonderful time.",
      sentenceArabic: "قضينا وقتاً رائعاً.",
    },
    {
      english: "work",
      arabic: "عمل",
      sentence: "My father goes to work at 8 AM.",
      sentenceArabic: "والدي يذهب إلى العمل عند الساعة 8 صباحاً.",
    },
    {
      english: "worker",
      arabic: "عامل",
      sentence: "The worker is building a house.",
      sentenceArabic: "العامل يبني منزلاً.",
    },
    {
      english: "world",
      arabic: "عالم",
      sentence: "I want to travel around the world.",
      sentenceArabic: "أريد أن أسافر حول العالم.",
    },
    {
      english: "would",
      arabic: "سوف",
      sentence: "I would like a cup of coffee.",
      sentenceArabic: "أود فنجاناً من القهوة.",
    },
    {
      english: "write",
      arabic: "يكتب",
      sentence: "I write in my notebook.",
      sentenceArabic: "أكتب في دفتر ملاحظاتي.",
    },
    {
      english: "writer",
      arabic: "كاتب",
      sentence: "My uncle is a famous writer.",
      sentenceArabic: "عمي كاتب مشهور.",
    },
    {
      english: "writing",
      arabic: "كتابة",
      sentence: "Writing is my hobby.",
      sentenceArabic: "الكتابة هي هوايتي.",
    },
    {
      english: "yeah",
      arabic: "نعم",
      sentence: "Yeah, I agree with you.",
      sentenceArabic: "نعم، أنا أتفق معك.",
    },
    {
      english: "year",
      arabic: "سنة",
      sentence: "There are twelve months in a year.",
      sentenceArabic: "هناك اثنا عشر شهراً في السنة.",
    },
    {
      english: "yellow",
      arabic: "أصفر",
      sentence: "The sun is yellow.",
      sentenceArabic: "الشمس صفراء.",
    },
    {
      english: "yes",
      arabic: "نعم",
      sentence: "Yes, I am ready.",
      sentenceArabic: "نعم، أنا مستعد.",
    },
    {
      english: "yesterday",
      arabic: "أمس",
      sentence: "I visited my grandmother yesterday.",
      sentenceArabic: "زرت جدتي أمس.",
    },
    {
      english: "you",
      arabic: "أنت",
      sentence: "You are my best friend.",
      sentenceArabic: "أنت صديقي المفضل.",
    },
    {
      english: "your",
      arabic: "لك",
      sentence: "What is your name?",
      sentenceArabic: "ما هو اسمك؟",
    },
    {
      english: "yourself",
      arabic: "نفسك",
      sentence: "Take care of yourself.",
      sentenceArabic: "اعتن بنفسك.",
    },
    {
      english: "classroom",
      arabic: "فصل دراسي",
      sentence: "Our classroom is big.",
      sentenceArabic: "فصلنا الدراسي كبير.",
    },
    {
      english: "clean",
      arabic: "نظيف",
      sentence: "My room is clean.",
      sentenceArabic: "غرفتي نظيفة.",
    },
    {
      english: "clock",
      arabic: "ساعة",
      sentence: "The clock on the wall is broken.",
      sentenceArabic: "الساعة على الحائط مكسورة.",
    },
    {
      english: "clothes",
      arabic: "ملابس",
      sentence: "I put my clothes in the closet.",
      sentenceArabic: "أضع ملابسي في الخزانة.",
    },
    {
      english: "club",
      arabic: "نادي",
      sentence: "I joined a sports club.",
      sentenceArabic: "انضممت إلى نادي رياضي.",
    },
    {
      english: "coat",
      arabic: "معطف",
      sentence: "I wear a coat in winter.",
      sentenceArabic: "أرتدي معطفاً في الشتاء.",
    },
    {
      english: "coffee",
      arabic: "قهوة",
      sentence: "I drink coffee in the morning.",
      sentenceArabic: "أشرب القهوة في الصباح.",
    },
    {
      english: "cold",
      arabic: "بارد",
      sentence: "The water is cold.",
      sentenceArabic: "الماء بارد.",
    },
    {
      english: "college",
      arabic: "كلية",
      sentence: "My sister studies at college.",
      sentenceArabic: "أختي تدرس في الكلية.",
    },
    {
      english: "colour",
      arabic: "لون",
      sentence: "Blue is my favourite colour.",
      sentenceArabic: "الأزرق هو لوني المفضل.",
    },
    {
      english: "come",
      arabic: "يأتي",
      sentence: "Come here, please.",
      sentenceArabic: "تعال إلى هنا من فضلك.",
    },
    {
      english: "common",
      arabic: "شائع",
      sentence: "This is a common problem.",
      sentenceArabic: "هذه مشكلة شائعة.",
    },
    {
      english: "company",
      arabic: "شركة",
      sentence: "My father works in a big company.",
      sentenceArabic: "والدي يعمل في شركة كبيرة.",
    },
    {
      english: "compare",
      arabic: "يقارن",
      sentence: "Let's compare these two books.",
      sentenceArabic: "دعنا نقارن هذين الكتابين.",
    },
    {
      english: "complete",
      arabic: "يكمل",
      sentence: "Please complete this form.",
      sentenceArabic: "أكمل هذا النموذج من فضلك.",
    },
    {
      english: "difficult",
      arabic: "صعب",
      sentence: "This exercise is difficult.",
      sentenceArabic: "هذا التمرين صعب.",
    },
    {
      english: "dinner",
      arabic: "عشاء",
      sentence: "We eat dinner at 7 PM.",
      sentenceArabic: "نأكل العشاء عند الساعة 7 مساءً.",
    },
    {
      english: "dirty",
      arabic: "قذر",
      sentence: "My shoes are dirty.",
      sentenceArabic: "حذائي قذر.",
    },
    {
      english: "discuss",
      arabic: "يناقش",
      sentence: "Let's discuss this topic.",
      sentenceArabic: "دعنا نناقش هذا الموضوع.",
    },
    {
      english: "dish",
      arabic: "طبق",
      sentence: "This dish is delicious.",
      sentenceArabic: "هذا الطبق لذيذ.",
    },
    {
      english: "do",
      arabic: "يفعل",
      sentence: "What do you do?",
      sentenceArabic: "ماذا تفعل؟",
    },
    {
      english: "doctor",
      arabic: "طبيب",
      sentence: "I need to see a doctor.",
      sentenceArabic: "أحتاج إلى رؤية طبيب.",
    },
    {
      english: "dog",
      arabic: "كلب",
      sentence: "My dog is very friendly.",
      sentenceArabic: "كلبي ودود جداً.",
    },
    {
      english: "dollar",
      arabic: "دولار",
      sentence: "This book costs ten dollars.",
      sentenceArabic: "هذا الكتاب يكلف عشرة دولارات.",
    },
    {
      english: "door",
      arabic: "باب",
      sentence: "Close the door, please.",
      sentenceArabic: "أغلق الباب من فضلك.",
    },
    {
      english: "down",
      arabic: "أسفل",
      sentence: "Sit down, please.",
      sentenceArabic: "اجلس من فضلك.",
    },
    {
      english: "draw",
      arabic: "يرسم",
      sentence: "I like to draw pictures.",
      sentenceArabic: "أحب أن أرسم صوراً.",
    },
    {
      english: "dress",
      arabic: "فستان",
      sentence: "She wears a beautiful dress.",
      sentenceArabic: "هي ترتدي فستاناً جميلاً.",
    },
    {
      english: "drink",
      arabic: "يشرب",
      sentence: "I drink water every day.",
      sentenceArabic: "أشرب الماء كل يوم.",
    },
    {
      english: "driver",
      arabic: "سائق",
      sentence: "My father is a bus driver.",
      sentenceArabic: "والدي سائق حافلة.",
    },
    {
      english: "feeling",
      arabic: "شعور",
      sentence: "I have a good feeling about this.",
      sentenceArabic: "لدي شعور جيد حول هذا.",
    },
    {
      english: "festival",
      arabic: "مهرجان",
      sentence: "We celebrate the festival every year.",
      sentenceArabic: "نحتفل بالمهرجان كل عام.",
    },
    {
      english: "few",
      arabic: "قليل",
      sentence: "I have a few friends.",
      sentenceArabic: "لدي القليل من الأصدقاء.",
    },
    {
      english: "fifteen",
      arabic: "خمسة عشر",
      sentence: "I have fifteen books.",
      sentenceArabic: "لدي خمسة عشر كتاباً.",
    },
    {
      english: "fifth",
      arabic: "خامس",
      sentence: "This is my fifth visit to this city.",
      sentenceArabic: "هذه زيارتي الخامسة لهذه المدينة.",
    },
    {
      english: "fifty",
      arabic: "خمسون",
      sentence: "My grandfather is fifty years old.",
      sentenceArabic: "جدي يبلغ من العمر خمسين عاماً.",
    },
    {
      english: "fill",
      arabic: "يملأ",
      sentence: "Please fill this bottle with water.",
      sentenceArabic: "املأ هذه الزجاجة بالماء من فضلك.",
    },
    {
      english: "find",
      arabic: "يجد",
      sentence: "I can't find my keys.",
      sentenceArabic: "لا أستطيع أن أجد مفاتيحي.",
    },
    {
      english: "fine",
      arabic: "بخير",
      sentence: "I'm fine, thank you.",
      sentenceArabic: "أنا بخير، شكراً لك.",
    },
    {
      english: "five",
      arabic: "خمسة",
      sentence: "I have five fingers on each hand.",
      sentenceArabic: "لدي خمسة أصابع في كل يد.",
    },
    {
      english: "flight",
      arabic: "رحلة جوية",
      sentence: "Our flight is delayed.",
      sentenceArabic: "رحلتنا الجوية متأخرة.",
    },
    {
      english: "floor",
      arabic: "أرضية",
      sentence: "The floor is clean.",
      sentenceArabic: "الأرضية نظيفة.",
    },
    {
      english: "flower",
      arabic: "زهرة",
      sentence: "I picked a beautiful flower.",
      sentenceArabic: "قطفت زهرة جميلة.",
    },
    {
      english: "follow",
      arabic: "يتبع",
      sentence: "Please follow me.",
      sentenceArabic: "من فضلك اتبعني.",
    },
    {
      english: "food",
      arabic: "طعام",
      sentence: "I like Italian food.",
      sentenceArabic: "أحب الطعام الإيطالي.",
    },
    {
      english: "foot",
      arabic: "قدم",
      sentence: "My foot hurts.",
      sentenceArabic: "قدمي تؤلمني.",
    },
    {
      english: "football",
      arabic: "كرة قدم",
      sentence: "We play football every weekend.",
      sentenceArabic: "نلعب كرة القدم كل نهاية أسبوع.",
    },
    {
      english: "for",
      arabic: "لأجل",
      sentence: "This gift is for you.",
      sentenceArabic: "هذه الهدية لك.",
    },
    {
      english: "forget",
      arabic: "ينسى",
      sentence: "Don't forget your keys.",
      sentenceArabic: "لا تنس مفاتيحك.",
    },
    {
      english: "form",
      arabic: "نموذج",
      sentence: "Please fill out this form.",
      sentenceArabic: "املأ هذا النموذج من فضلك.",
    },
    {
      english: "husband",
      arabic: "زوج",
      sentence: "My husband is a teacher.",
      sentenceArabic: "زوجي مدرس.",
    },
    {
      english: "I",
      arabic: "أنا",
      sentence: "I am a student.",
      sentenceArabic: "أنا طالب.",
    },
    {
      english: "ice",
      arabic: "ثلج",
      sentence: "The ice is cold.",
      sentenceArabic: "الثلج بارد.",
    },
    {
      english: "idea",
      arabic: "فكرة",
      sentence: "That's a good idea.",
      sentenceArabic: "هذه فكرة جيدة.",
    },
    {
      english: "if",
      arabic: "إذا",
      sentence: "I will come if I have time.",
      sentenceArabic: "سآتي إذا كان لدي وقت.",
    },
    {
      english: "imagine",
      arabic: "يتخيل",
      sentence: "Imagine a beautiful beach.",
      sentenceArabic: "تخيل شاطئاً جميلاً.",
    },
    {
      english: "important",
      arabic: "مهم",
      sentence: "This is an important meeting.",
      sentenceArabic: "هذا اجتماع مهم.",
    },
    {
      english: "improve",
      arabic: "يحسن",
      sentence: "I want to improve my English.",
      sentenceArabic: "أريد أن أحسن لغتي الإنجليزية.",
    },
    {
      english: "in",
      arabic: "في",
      sentence: "The book is in the bag.",
      sentenceArabic: "الكتاب في الحقيبة.",
    },
    {
      english: "include",
      arabic: "يتضمن",
      sentence: "The price includes breakfast.",
      sentenceArabic: "السعر يتضمن الإفطار.",
    },
    {
      english: "information",
      arabic: "معلومات",
      sentence: "I need more information.",
      sentenceArabic: "أحتاج إلى مزيد من المعلومات.",
    },
    {
      english: "main",
      arabic: "رئيسي",
      sentence: "This is the main road.",
      sentenceArabic: "هذا هو الطريق الرئيسي.",
    },
    {
      english: "man",
      arabic: "رجل",
      sentence: "That man is my father.",
      sentenceArabic: "ذلك الرجل هو والدي.",
    },
    {
      english: "many",
      arabic: "كثير",
      sentence: "How many books do you have?",
      sentenceArabic: "كم كتاب لديك؟",
    },
    {
      english: "March",
      arabic: "مارس",
      sentence: "Spring begins in March.",
      sentenceArabic: "الربيع يبدأ في مارس.",
    },
    {
      english: "married",
      arabic: "متزوج",
      sentence: "They are married.",
      sentenceArabic: "هم متزوجون.",
    },
    {
      english: "May",
      arabic: "مايو",
      sentence: "We travel in May.",
      sentenceArabic: "نسافر في مايو.",
    },
    {
      english: "maybe",
      arabic: "ربما",
      sentence: "Maybe I will come tomorrow.",
      sentenceArabic: "ربما سآتي غداً.",
    },
    {
      english: "me",
      arabic: "لي",
      sentence: "Give me the book, please.",
      sentenceArabic: "أعطني الكتاب من فضلك.",
    },
    {
      english: "meal",
      arabic: "وجبة",
      sentence: "We eat three meals a day.",
      sentenceArabic: "نأكل ثلاث وجبات في اليوم.",
    },
    {
      english: "mean",
      arabic: "يعني",
      sentence: "What does this word mean?",
      sentenceArabic: "ماذا تعني هذه الكلمة؟",
    },
    {
      english: "meaning",
      arabic: "معنى",
      sentence: "I don't understand the meaning.",
      sentenceArabic: "أنا لا أفهم المعنى.",
    },
    {
      english: "meat",
      arabic: "لحم",
      sentence: "I don't eat meat.",
      sentenceArabic: "أنا لا آكل اللحم.",
    },
    {
      english: "meet",
      arabic: "يلتقي",
      sentence: "Nice to meet you.",
      sentenceArabic: "سعيد بلقائك.",
    },
    {
      english: "meeting",
      arabic: "اجتماع",
      sentence: "I have a meeting at 10 AM.",
      sentenceArabic: "لدي اجتماع في الساعة 10 صباحاً.",
    },
    {
      english: "member",
      arabic: "عضو",
      sentence: "I am a member of this club.",
      sentenceArabic: "أنا عضو في هذا النادي.",
    },
    {
      english: "menu",
      arabic: "قائمة طعام",
      sentence: "Can I see the menu, please?",
      sentenceArabic: "هل يمكنني رؤية قائمة الطعام من فضلك؟",
    },
    {
      english: "message",
      arabic: "رسالة",
      sentence: "I received your message.",
      sentenceArabic: "تلقيت رسالتك.",
    },
    {
      english: "metre",
      arabic: "متر",
      sentence: "This room is five metres long.",
      sentenceArabic: "هذه الغرفة طولها خمسة أمتار.",
    },
    {
      english: "midnight",
      arabic: "منتصف الليل",
      sentence: "I go to bed before midnight.",
      sentenceArabic: "أذهب إلى السرير قبل منتصف الليل.",
    },
    {
      english: "mile",
      arabic: "ميل",
      sentence: "The school is two miles away.",
      sentenceArabic: "المدرسة على بعد ميلين.",
    },
    {
      english: "milk",
      arabic: "حليب",
      sentence: "I drink milk every day.",
      sentenceArabic: "أشرب الحليب كل يوم.",
    },
    {
      english: "page",
      arabic: "صفحة",
      sentence: "Turn to page 10, please.",
      sentenceArabic: "انتقل إلى الصفحة 10 من فضلك.",
    },
    {
      english: "paint",
      arabic: "يرسم",
      sentence: "I like to paint pictures.",
      sentenceArabic: "أحب أن أرسم صوراً.",
    },
    {
      english: "painting",
      arabic: "رسم",
      sentence: "This is a beautiful painting.",
      sentenceArabic: "هذه رسمة جميلة.",
    },
    {
      english: "pair",
      arabic: "زوج",
      sentence: "I need a pair of shoes.",
      sentenceArabic: "أحتاج إلى زوج من الأحذية.",
    },
    {
      english: "paper",
      arabic: "ورقة",
      sentence: "Write on the paper, please.",
      sentenceArabic: "اكتب على الورقة من فضلك.",
    },
    {
      english: "paragraph",
      arabic: "فقرة",
      sentence: "Read the first paragraph.",
      sentenceArabic: "اقرأ الفقرة الأولى.",
    },
    {
      english: "parent",
      arabic: "والد",
      sentence: "My parents are teachers.",
      sentenceArabic: "والداي مدرسان.",
    },
    {
      english: "park",
      arabic: "حديقة",
      sentence: "We walk in the park every evening.",
      sentenceArabic: "نمشي في الحديقة كل مساء.",
    },
    {
      english: "part",
      arabic: "جزء",
      sentence: "This is my favorite part of the book.",
      sentenceArabic: "هذا هو جزئي المفضل من الكتاب.",
    },
    {
      english: "partner",
      arabic: "شريك",
      sentence: "My business partner is from France.",
      sentenceArabic: "شريكي في العمل من فرنسا.",
    },
    {
      english: "party",
      arabic: "حفلة",
      sentence: "We have a party on Saturday.",
      sentenceArabic: "لدينا حفلة يوم السبت.",
    },
    {
      english: "passport",
      arabic: "جواز سفر",
      sentence: "I need my passport to travel.",
      sentenceArabic: "أحتاج إلى جواز سفري للسفر.",
    },
    {
      english: "pen",
      arabic: "قلم",
      sentence: "I write with a pen.",
      sentenceArabic: "أكتب بقلم.",
    },
    {
      english: "pencil",
      arabic: "قلم رصاص",
      sentence: "I draw with a pencil.",
      sentenceArabic: "أرسم بقلم رصاص.",
    },
    {
      english: "people",
      arabic: "ناس",
      sentence: "Many people live in this city.",
      sentenceArabic: "الكثير من الناس يعيشون في هذه المدينة.",
    },
    {
      english: "pepper",
      arabic: "فلفل",
      sentence: "I add pepper to my food.",
      sentenceArabic: "أضيف الفلفل إلى طعامي.",
    },
    {
      english: "perfect",
      arabic: "مثالي",
      sentence: "Your English is perfect.",
      sentenceArabic: "لغتك الإنجليزية مثالية.",
    },
    {
      english: "period",
      arabic: "فترة",
      sentence: "We have a break period.",
      sentenceArabic: "لدينا فترة استراحة.",
    },
    {
      english: "person",
      arabic: "شخص",
      sentence: "He is a nice person.",
      sentenceArabic: "هو شخص لطيف.",
    },
    {
      english: "personal",
      arabic: "شخصي",
      sentence: "This is my personal opinion.",
      sentenceArabic: "هذا هو رأيي الشخصي.",
    },
    {
      english: "phone",
      arabic: "هاتف",
      sentence: "I call my friends on the phone.",
      sentenceArabic: "أتصل بأصدقائي على الهاتف.",
    },
    {
      english: "ready",
      arabic: "مستعد",
      sentence: "I am ready to go.",
      sentenceArabic: "أنا مستعد للذهاب.",
    },
    {
      english: "real",
      arabic: "حقيقي",
      sentence: "This is a real diamond.",
      sentenceArabic: "هذا ماس حقيقي.",
    },
    {
      english: "really",
      arabic: "حقاً",
      sentence: "I really like this book.",
      sentenceArabic: "أنا حقاً أحب هذا الكتاب.",
    },
    {
      english: "reason",
      arabic: "سبب",
      sentence: "What is the reason?",
      sentenceArabic: "ما هو السبب؟",
    },
    {
      english: "red",
      arabic: "أحمر",
      sentence: "The apple is red.",
      sentenceArabic: "التفاحة حمراء.",
    },
    {
      english: "relax",
      arabic: "يسترخي",
      sentence: "I relax on the weekend.",
      sentenceArabic: "أنا أسترخي في نهاية الأسبوع.",
    },
    {
      english: "remember",
      arabic: "يتذكر",
      sentence: "I remember your name.",
      sentenceArabic: "أتذكر اسمك.",
    },
    {
      english: "sing",
      arabic: "يغني",
      sentence: "I like to sing songs.",
      sentenceArabic: "أحب أن أغني الأغاني.",
    },
    {
      english: "singer",
      arabic: "مغني",
      sentence: "She is a famous singer.",
      sentenceArabic: "هي مغنية مشهورة.",
    },
    {
      english: "sister",
      arabic: "أخت",
      sentence: "My sister is older than me.",
      sentenceArabic: "أختي أكبر مني.",
    },
    {
      english: "sit",
      arabic: "يجلس",
      sentence: "Sit down, please.",
      sentenceArabic: "اجلس من فضلك.",
    },
    {
      english: "situation",
      arabic: "موقف",
      sentence: "This is a difficult situation.",
      sentenceArabic: "هذا موقف صعب.",
    },
    {
      english: "six",
      arabic: "ستة",
      sentence: "I have six books.",
      sentenceArabic: "لدي ستة كتب.",
    },
    {
      english: "sixteen",
      arabic: "ستة عشر",
      sentence: "My brother is sixteen years old.",
      sentenceArabic: "أخي يبلغ من العمر ستة عشر عاماً.",
    },
    {
      english: "sixty",
      arabic: "ستون",
      sentence: "My grandmother is sixty years old.",
      sentenceArabic: "جدتي تبلغ من العمر ستين عاماً.",
    },
    {
      english: "skill",
      arabic: "مهارة",
      sentence: "Reading is an important skill.",
      sentenceArabic: "القراءة مهارة مهمة.",
    },
    {
      english: "skirt",
      arabic: "تنورة",
      sentence: "She wears a blue skirt.",
      sentenceArabic: "هي ترتدي تنورة زرقاء.",
    },
    {
      english: "small",
      arabic: "صغير",
      sentence: "This is a small house.",
      sentenceArabic: "هذا منزل صغير.",
    },
    {
      english: "snake",
      arabic: "ثعبان",
      sentence: "I am afraid of snakes.",
      sentenceArabic: "أنا خائف من الثعابين.",
    },
    {
      english: "snow",
      arabic: "ثلج",
      sentence: "It snows in winter.",
      sentenceArabic: "تتساقط الثلوج في الشتاء.",
    },
    {
      english: "so",
      arabic: "لذلك",
      sentence: "I was tired, so I went to bed early.",
      sentenceArabic: "كنت متعباً، لذلك ذهبت إلى السرير مبكراً.",
    },
    {
      english: "some",
      arabic: "بعض",
      sentence: "I need some help.",
      sentenceArabic: "أحتاج إلى بعض المساعدة.",
    },
    {
      english: "somebody",
      arabic: "شخص ما",
      sentence: "Somebody is at the door.",
      sentenceArabic: "هناك شخص ما عند الباب.",
    },
    {
      english: "someone",
      arabic: "شخص ما",
      sentence: "Someone called you.",
      sentenceArabic: "شخص ما اتصل بك.",
    },
    {
      english: "something",
      arabic: "شيء ما",
      sentence: "I want to tell you something.",
      sentenceArabic: "أريد أن أخبرك بشيء ما.",
    },
    {
      english: "sometimes",
      arabic: "أحياناً",
      sentence: "Sometimes I go to the cinema.",
      sentenceArabic: "أحياناً أذهب إلى السينما.",
    },
    {
      english: "son",
      arabic: "ابن",
      sentence: "My son is a student.",
      sentenceArabic: "ابني طالب.",
    },
    {
      english: "song",
      arabic: "أغنية",
      sentence: "This is my favorite song.",
      sentenceArabic: "هذه أغنيتي المفضلة.",
    },
    {
      english: "soon",
      arabic: "قريباً",
      sentence: "See you soon.",
      sentenceArabic: "أراك قريباً.",
    },
    {
      english: "sorry",
      arabic: "آسف",
      sentence: "I am sorry for being late.",
      sentenceArabic: "أنا آسف على التأخير.",
    },
    {
      english: "apartment",
      arabic: "شقة",
      sentence: "I live in a small apartment.",
      sentenceArabic: "أعيش في شقة صغيرة.",
    },
    {
      english: "apple",
      arabic: "تفاح",
      sentence: "I eat an apple every day.",
      sentenceArabic: "آكل تفاحة كل يوم.",
    },
    {
      english: "April",
      arabic: "أبريل",
      sentence: "It rains a lot in April.",
      sentenceArabic: "تمطر كثيراً في أبريل.",
    },
    {
      english: "area",
      arabic: "منطقة",
      sentence: "This is a quiet area.",
      sentenceArabic: "هذه منطقة هادئة.",
    },
    {
      english: "arm",
      arabic: "ذراع",
      sentence: "My arm hurts.",
      sentenceArabic: "ذراعي تؤلمني.",
    },
    {
      english: "around",
      arabic: "حول",
      sentence: "We walked around the city.",
      sentenceArabic: "مشينا حول المدينة.",
    },
    {
      english: "arrive",
      arabic: "يصل",
      sentence: "We arrive at 8 PM.",
      sentenceArabic: "نصل عند الساعة 8 مساءً.",
    },
    {
      english: "art",
      arabic: "فن",
      sentence: "I like modern art.",
      sentenceArabic: "أحب الفن الحديث.",
    },
    {
      english: "article",
      arabic: "مقال",
      sentence: "I read an interesting article.",
      sentenceArabic: "قرأت مقالاً مثيراً للاهتمام.",
    },
    {
      english: "artist",
      arabic: "فنان",
      sentence: "My friend is an artist.",
      sentenceArabic: "صديقي فنان.",
    },
    {
      english: "ask",
      arabic: "يسأل",
      sentence: "Can I ask you a question?",
      sentenceArabic: "هل يمكنني أن أسألك سؤالاً؟",
    },
    {
      english: "at",
      arabic: "في",
      sentence: "I am at home.",
      sentenceArabic: "أنا في البيت.",
    },
    {
      english: "table",
      arabic: "طاولة",
      sentence: "The book is on the table.",
      sentenceArabic: "الكتاب على الطاولة.",
    },
    {
      english: "take",
      arabic: "يأخذ",
      sentence: "Take this book, please.",
      sentenceArabic: "خذ هذا الكتاب من فضلك.",
    },
    {
      english: "tall",
      arabic: "طويل",
      sentence: "He is very tall.",
      sentenceArabic: "هو طويل جداً.",
    },
    {
      english: "taxi",
      arabic: "تاكسي",
      sentence: "We take a taxi to the airport.",
      sentenceArabic: "نأخذ تاكسي إلى المطار.",
    },
    {
      english: "tea",
      arabic: "شاي",
      sentence: "I drink tea in the morning.",
      sentenceArabic: "أشرب الشاي في الصباح.",
    },
    {
      english: "teach",
      arabic: "يعلم",
      sentence: "My mother teaches English.",
      sentenceArabic: "أمي تعلم الإنجليزية.",
    },
    {
      english: "teacher",
      arabic: "معلم",
      sentence: "My teacher is very kind.",
      sentenceArabic: "معلمي طيب جداً.",
    },
    {
      english: "team",
      arabic: "فريق",
      sentence: "Our team won the match.",
      sentenceArabic: "فريقنا فاز بالمباراة.",
    },
    {
      english: "teenager",
      arabic: "مراهق",
      sentence: "My brother is a teenager.",
      sentenceArabic: "أخي مراهق.",
    },
    {
      english: "telephone",
      arabic: "هاتف",
      sentence: "I call my friends on the telephone.",
      sentenceArabic: "أتصل بأصدقائي على الهاتف.",
    },
    {
      english: "television",
      arabic: "تلفاز",
      sentence: "We watch television in the evening.",
      sentenceArabic: "نشاهد التلفاز في المساء.",
    },
    {
      english: "tell",
      arabic: "يخبر",
      sentence: "Tell me your name, please.",
      sentenceArabic: "أخبرني باسمك من فضلك.",
    },
    {
      english: "ten",
      arabic: "عشرة",
      sentence: "I have ten fingers.",
      sentenceArabic: "لدي عشرة أصابع.",
    },
    {
      english: "tennis",
      arabic: "تنس",
      sentence: "We play tennis on weekends.",
      sentenceArabic: "نلعب التنس في عطلة نهاية الأسبوع.",
    },
    {
      english: "terrible",
      arabic: "فظيع",
      sentence: "The weather is terrible today.",
      sentenceArabic: "الطقس فظيع اليوم.",
    },
    {
      english: "test",
      arabic: "اختبار",
      sentence: "We have a test tomorrow.",
      sentenceArabic: "لدينا اختبار غداً.",
    },
    {
      english: "than",
      arabic: "من",
      sentence: "She is taller than me.",
      sentenceArabic: "هي أطول مني.",
    },
    {
      english: "thank",
      arabic: "يشكر",
      sentence: "Thank you for your help.",
      sentenceArabic: "شكراً لك على مساعدتك.",
    },
    {
      english: "thanks",
      arabic: "شكراً",
      sentence: "Thanks for the gift.",
      sentenceArabic: "شكراً على الهدية.",
    },
    {
      english: "the",
      arabic: "ال",
      sentence: "The book is on the table.",
      sentenceArabic: "الكتاب على الطاولة.",
    },
    {
      english: "theatre",
      arabic: "مسرح",
      sentence: "We went to the theatre last night.",
      sentenceArabic: "ذهبنا إلى المسرح الليلة الماضية.",
    },
    {
      english: "their",
      arabic: "لهم",
      sentence: "This is their house.",
      sentenceArabic: "هذا هو منزلهم.",
    },
    {
      english: "them",
      arabic: "هم",
      sentence: "I know them.",
      sentenceArabic: "أنا أعرفهم.",
    },
    {
      english: "then",
      arabic: "ثم",
      sentence: "We eat dinner, then we watch TV.",
      sentenceArabic: "نأكل العشاء، ثم نشاهد التلفاز.",
    },
    {
      english: "there",
      arabic: "هناك",
      sentence: "The book is there on the table.",
      sentenceArabic: "الكتاب هناك على الطاولة.",
    },
    {
      english: "they",
      arabic: "هم",
      sentence: "They are my friends.",
      sentenceArabic: "هم أصدقائي.",
    },
    {
      english: "thing",
      arabic: "شيء",
      sentence: "This is a beautiful thing.",
      sentenceArabic: "هذا شيء جميل.",
    },
    {
      english: "think",
      arabic: "يفكر",
      sentence: "I think you are right.",
      sentenceArabic: "أعتقد أنك على حق.",
    },
    {
      english: "thirsty",
      arabic: "عطشان",
      sentence: "I am thirsty.",
      sentenceArabic: "أنا عطشان.",
    },
    {
      english: "thirteen",
      arabic: "ثلاثة عشر",
      sentence: "My sister is thirteen years old.",
      sentenceArabic: "أختي تبلغ من العمر ثلاثة عشر عاماً.",
    },
    {
      english: "thirty",
      arabic: "ثلاثون",
      sentence: "My father is thirty years old.",
      sentenceArabic: "والدي يبلغ من العمر ثلاثين عاماً.",
    },
    {
      english: "want",
      arabic: "يريد",
      sentence: "I want to learn English.",
      sentenceArabic: "أريد أن أتعلم الإنجليزية.",
    },
    {
      english: "watch",
      arabic: "ساعة",
      sentence: "I look at my watch.",
      sentenceArabic: "أنظر إلى ساعتي.",
    },
    {
      english: "we",
      arabic: "نحن",
      sentence: "We are students.",
      sentenceArabic: "نحن طلاب.",
    },
    {
      english: "wear",
      arabic: "يرتدي",
      sentence: "I wear a jacket in winter.",
      sentenceArabic: "أرتدي jacket في الشتاء.",
    },
    {
      english: "weather",
      arabic: "طقس",
      sentence: "The weather is nice today.",
      sentenceArabic: "الطقس جميل اليوم.",
    },
    {
      english: "website",
      arabic: "موقع إلكتروني",
      sentence: "I visit this website every day.",
      sentenceArabic: "أزور هذا الموقع الإلكتروني كل يوم.",
    },
    {
      english: "Wednesday",
      arabic: "الأربعاء",
      sentence: "We have a meeting on Wednesday.",
      sentenceArabic: "لدينا اجتماع يوم الأربعاء.",
    },
    {
      english: "week",
      arabic: "أسبوع",
      sentence: "There are seven days in a week.",
      sentenceArabic: "هناك سبعة أيام في الأسبوع.",
    },
    {
      english: "weekend",
      arabic: "نهاية الأسبوع",
      sentence: "I relax on the weekend.",
      sentenceArabic: "أسترخي في نهاية الأسبوع.",
    },
    {
      english: "well",
      arabic: "جيد",
      sentence: "I speak English well.",
      sentenceArabic: "أتحدث الإنجليزية جيداً.",
    },
    {
      english: "west",
      arabic: "غرب",
      sentence: "The sun sets in the west.",
      sentenceArabic: "الشمس تغرب في الغرب.",
    },
    {
      english: "what",
      arabic: "ماذا",
      sentence: "What is your name?",
      sentenceArabic: "ما هو اسمك؟",
    },
    {
      english: "when",
      arabic: "متى",
      sentence: "When do you go to school?",
      sentenceArabic: "متى تذهب إلى المدرسة؟",
    },
    {
      english: "where",
      arabic: "أين",
      sentence: "Where do you live?",
      sentenceArabic: "أين تعيش؟",
    },
    {
      english: "which",
      arabic: "أي",
      sentence: "Which book do you want?",
      sentenceArabic: "أي كتاب تريد؟",
    },
    {
      english: "white",
      arabic: "أبيض",
      sentence: "The snow is white.",
      sentenceArabic: "الثلج أبيض.",
    },
    {
      english: "who",
      arabic: "من",
      sentence: "Who is your teacher?",
      sentenceArabic: "من هو معلمك؟",
    },
    {
      english: "why",
      arabic: "لماذا",
      sentence: "Why are you late?",
      sentenceArabic: "لماذا أنت متأخر؟",
    },
    {
      english: "wife",
      arabic: "زوجة",
      sentence: "My wife is a doctor.",
      sentenceArabic: "زوجتي طبيبة.",
    },
    {
      english: "carrot",
      arabic: "جزر",
      sentence: "I like to eat carrots.",
      sentenceArabic: "أحب أن آكل الجزر.",
    },
    {
      english: "carry",
      arabic: "يحمل",
      sentence: "I carry my books to school.",
      sentenceArabic: "أحمل كتبي إلى المدرسة.",
    },
    {
      english: "cat",
      arabic: "قطة",
      sentence: "My cat is black.",
      sentenceArabic: "قطتي سوداء.",
    },
    {
      english: "CD",
      arabic: "قرص مدمج",
      sentence: "I listen to music on a CD.",
      sentenceArabic: "أستمع إلى الموسيقى على قرص مدمج.",
    },
    {
      english: "cent",
      arabic: "سنت",
      sentence: "One dollar is one hundred cents.",
      sentenceArabic: "الدولار الواحد يساوي مائة سنت.",
    },
    {
      english: "century",
      arabic: "قرن",
      sentence: "We live in the 21st century.",
      sentenceArabic: "نحن نعيش في القرن الحادي والعشرين.",
    },
    {
      english: "change",
      arabic: "يتغير",
      sentence: "The weather changes quickly.",
      sentenceArabic: "الطقس يتغير بسرعة.",
    },
    {
      english: "cheese",
      arabic: "جبن",
      sentence: "I like cheese on my sandwich.",
      sentenceArabic: "أحب الجبن على ساندويتشي.",
    },
    {
      english: "chicken",
      arabic: "دجاج",
      sentence: "We eat chicken for dinner.",
      sentenceArabic: "نأكل الدجاج على العشاء.",
    },
    {
      english: "child",
      arabic: "طفل",
      sentence: "The child is playing.",
      sentenceArabic: "الطفل يلعب.",
    },
    {
      english: "chocolate",
      arabic: "شوكولاتة",
      sentence: "I love chocolate.",
      sentenceArabic: "أحب الشوكولاتة.",
    },
    {
      english: "choose",
      arabic: "يختار",
      sentence: "Choose a book, please.",
      sentenceArabic: "اختر كتاباً من فضلك.",
    },
    {
      english: "cinema",
      arabic: "سينما",
      sentence: "We go to the cinema on Fridays.",
      sentenceArabic: "نذهب إلى السينما يوم الجمعة.",
    },
    {
      english: "city",
      arabic: "مدينة",
      sentence: "I live in a big city.",
      sentenceArabic: "أعيش في مدينة كبيرة.",
    },
    {
      english: "class",
      arabic: "فصل",
      sentence: "Our English class is interesting.",
      sentenceArabic: "فصل اللغة الإنجليزية مثير للاهتمام.",
    },
    {
      english: "December",
      arabic: "ديسمبر",
      sentence: "Christmas is in December.",
      sentenceArabic: "عيد الميلاد في ديسمبر.",
    },
    {
      english: "decide",
      arabic: "يقرر",
      sentence: "I can't decide what to eat.",
      sentenceArabic: "لا أستطيع أن أقرر ماذا آكل.",
    },
    {
      english: "delicious",
      arabic: "لذيذ",
      sentence: "This food is delicious.",
      sentenceArabic: "هذا الطعام لذيذ.",
    },
    {
      english: "describe",
      arabic: "يصف",
      sentence: "Can you describe your house?",
      sentenceArabic: "هل يمكنك أن تصف منزلك؟",
    },
    {
      english: "description",
      arabic: "وصف",
      sentence: "I need a description of the person.",
      sentenceArabic: "أحتاج إلى وصف الشخص.",
    },
    {
      english: "design",
      arabic: "تصميم",
      sentence: "I like the design of this building.",
      sentenceArabic: "أحب تصميم هذا المبنى.",
    },
    {
      english: "desk",
      arabic: "مكتب",
      sentence: "The book is on the desk.",
      sentenceArabic: "الكتاب على المكتب.",
    },
    {
      english: "dialogue",
      arabic: "حوار",
      sentence: "We practice dialogue in class.",
      sentenceArabic: "نمارس الحوار في الفصل.",
    },
    {
      english: "dictionary",
      arabic: "قاموس",
      sentence: "I use a dictionary to learn new words.",
      sentenceArabic: "أستخدم القاموس لتعلم كلمات جديدة.",
    },
    {
      english: "die",
      arabic: "يموت",
      sentence: "Flowers die without water.",
      sentenceArabic: "الزهور تموت بدون ماء.",
    },
    {
      english: "diet",
      arabic: "حمية",
      sentence: "I am on a diet.",
      sentenceArabic: "أنا على حمية.",
    },
    {
      english: "difference",
      arabic: "فرق",
      sentence: "What is the difference?",
      sentenceArabic: "ما هو الفرق؟",
    },
    {
      english: "different",
      arabic: "مختلف",
      sentence: "We have different opinions.",
      sentenceArabic: "لدينا آراء مختلفة.",
    },
    {
      english: "expensive",
      arabic: "غالي",
      sentence: "This car is expensive.",
      sentenceArabic: "هذه السيارة غالية.",
    },
    {
      english: "explain",
      arabic: "يشرح",
      sentence: "Can you explain this to me?",
      sentenceArabic: "هل يمكنك أن تشرح هذا لي؟",
    },
    {
      english: "eye",
      arabic: "عين",
      sentence: "I have blue eyes.",
      sentenceArabic: "لدي عيون زرقاء.",
    },
    {
      english: "fact",
      arabic: "حقيقة",
      sentence: "This is a fact, not an opinion.",
      sentenceArabic: "هذه حقيقة، ليس رأياً.",
    },
    {
      english: "false",
      arabic: "خاطئ",
      sentence: "This statement is false.",
      sentenceArabic: "هذه العبارة خاطئة.",
    },
    {
      english: "family",
      arabic: "عائلة",
      sentence: "I love my family.",
      sentenceArabic: "أحب عائلتي.",
    },
    {
      english: "famous",
      arabic: "شهير",
      sentence: "He is a famous actor.",
      sentenceArabic: "هو ممثل شهير.",
    },
    {
      english: "fantastic",
      arabic: "رائع",
      sentence: "We had a fantastic time.",
      sentenceArabic: "قضينا وقتاً رائعاً.",
    },
    {
      english: "farmer",
      arabic: "مزارع",
      sentence: "My uncle is a farmer.",
      sentenceArabic: "عمي مزارع.",
    },
    {
      english: "fast",
      arabic: "سريع",
      sentence: "He runs very fast.",
      sentenceArabic: "هو يركض非常 سريع.",
    },
    {
      english: "father",
      arabic: "أب",
      sentence: "My father is a doctor.",
      sentenceArabic: "والدي طبيب.",
    },
    {
      english: "favourite",
      arabic: "مفضل",
      sentence: "Blue is my favourite colour.",
      sentenceArabic: "الأزرق هو لوني المفضل.",
    },
    {
      english: "February",
      arabic: "فبراير",
      sentence: "February is the shortest month.",
      sentenceArabic: "فبراير هو أقصر شهر.",
    },
    {
      english: "hear",
      arabic: "يسمع",
      sentence: "I hear music.",
      sentenceArabic: "أسمع الموسيقى.",
    },
    {
      english: "hello",
      arabic: "مرحباً",
      sentence: "Hello, how are you?",
      sentenceArabic: "مرحباً، كيف حالك؟",
    },
    {
      english: "help",
      arabic: "يساعد",
      sentence: "Can you help me, please?",
      sentenceArabic: "هل يمكنك مساعدتي من فضلك؟",
    },
    {
      english: "her",
      arabic: "لها",
      sentence: "This is her book.",
      sentenceArabic: "هذا كتابها.",
    },
    {
      english: "here",
      arabic: "هنا",
      sentence: "Come here, please.",
      sentenceArabic: "تعال إلى هنا من فضلك.",
    },
    {
      english: "hey",
      arabic: "مرحباً",
      sentence: "Hey, what's up?",
      sentenceArabic: "مرحباً، ما الأخبار؟",
    },
    {
      english: "hi",
      arabic: "مرحباً",
      sentence: "Hi, my name is John.",
      sentenceArabic: "مرحباً، اسمي جون.",
    },
    {
      english: "him",
      arabic: "له",
      sentence: "I know him.",
      sentenceArabic: "أنا أعرفه.",
    },
    {
      english: "history",
      arabic: "تاريخ",
      sentence: "I study history at school.",
      sentenceArabic: "أدرس التاريخ في المدرسة.",
    },
    {
      english: "hobby",
      arabic: "هواية",
      sentence: "Reading is my hobby.",
      sentenceArabic: "القراءة هي هوايتي.",
    },
    {
      english: "holiday",
      arabic: "عطلة",
      sentence: "We go on holiday in summer.",
      sentenceArabic: "نذهب في عطلة في الصيف.",
    },
    {
      english: "homework",
      arabic: "واجب منزلي",
      sentence: "I do my homework after school.",
      sentenceArabic: "أقوم بواجبي المنزلي بعد المدرسة.",
    },
    {
      english: "horse",
      arabic: "حصان",
      sentence: "I like to ride horses.",
      sentenceArabic: "أحب أن أركب الخيول.",
    },
    {
      english: "hospital",
      arabic: "مستشفى",
      sentence: "My mother works in a hospital.",
      sentenceArabic: "أمي تعمل في مستشفى.",
    },
    {
      english: "hot",
      arabic: "ساخن",
      sentence: "The tea is hot.",
      sentenceArabic: "الشاي ساخن.",
    },
    {
      english: "hotel",
      arabic: "فندق",
      sentence: "We stay in a hotel when we travel.",
      sentenceArabic: "نقيم في فندق عندما نسافر.",
    },
    {
      english: "hour",
      arabic: "ساعة",
      sentence: "I work eight hours a day.",
      sentenceArabic: "أعمل ثماني ساعات في اليوم.",
    },
    {
      english: "how",
      arabic: "كيف",
      sentence: "How are you?",
      sentenceArabic: "كيف حالك؟",
    },
    {
      english: "however",
      arabic: "however",
      sentence: "However, I disagree with you.",
      sentenceArabic: "however، أنا أختلف معك.",
    },
    {
      english: "hundred",
      arabic: "مائة",
      sentence: "I have hundred dollars.",
      sentenceArabic: "لدي مائة دولار.",
    },
    {
      english: "hungry",
      arabic: "جائع",
      sentence: "I am hungry.",
      sentenceArabic: "أنا جائع.",
    },
    {
      english: "lesson",
      arabic: "درس",
      sentence: "We have an English lesson today.",
      sentenceArabic: "لدينا درس إنجليزي اليوم.",
    },
    {
      english: "let",
      arabic: "يدع",
      sentence: "Let me help you.",
      sentenceArabic: "دعني أساعدك.",
    },
    {
      english: "letter",
      arabic: "رسالة",
      sentence: "I write a letter to my friend.",
      sentenceArabic: "أكتب رسالة إلى صديقي.",
    },
    {
      english: "library",
      arabic: "مكتبة",
      sentence: "I study in the library.",
      sentenceArabic: "أدرس في المكتبة.",
    },
    {
      english: "lie",
      arabic: "يكذب",
      sentence: "It is not good to lie.",
      sentenceArabic: "ليس من الجيد أن تكذب.",
    },
    {
      english: "life",
      arabic: "حياة",
      sentence: "Life is beautiful.",
      sentenceArabic: "الحياة جميلة.",
    },
    {
      english: "lion",
      arabic: "أسد",
      sentence: "The lion is the king of animals.",
      sentenceArabic: "الأسد هو ملك الحيوانات.",
    },
    {
      english: "list",
      arabic: "قائمة",
      sentence: "I make a list of things to buy.",
      sentenceArabic: "أعد قائمة بالأشياء التي يجب شراؤها.",
    },
    {
      english: "listen",
      arabic: "يستمع",
      sentence: "I listen to music.",
      sentenceArabic: "أستمع إلى الموسيقى.",
    },
    {
      english: "live",
      arabic: "يعيش",
      sentence: "I live in a small town.",
      sentenceArabic: "أعيش في مدينة صغيرة.",
    },
    {
      english: "long",
      arabic: "طويل",
      sentence: "The river is very long.",
      sentenceArabic: "النهر طويل جداً.",
    },
    {
      english: "lose",
      arabic: "يخسر",
      sentence: "I don't like to lose.",
      sentenceArabic: "أنا لا أحب أن أخسر.",
    },
    {
      english: "lot",
      arabic: "كثير",
      sentence: "I have a lot of books.",
      sentenceArabic: "لدي الكثير من الكتب.",
    },
    {
      english: "love",
      arabic: "حب",
      sentence: "I love my family.",
      sentenceArabic: "أحب عائلتي.",
    },
    {
      english: "lunch",
      arabic: "غداء",
      sentence: "We eat lunch at 1 PM.",
      sentenceArabic: "نأكل الغداء عند الساعة 1 ظهراً.",
    },
    {
      english: "machine",
      arabic: "آلة",
      sentence: "This machine makes coffee.",
      sentenceArabic: "هذه الآلة تصنع القهوة.",
    },
    {
      english: "magazine",
      arabic: "مجلة",
      sentence: "I read magazines in my free time.",
      sentenceArabic: "أقرأ المجلات في وقت فراغي.",
    },
    {
      english: "October",
      arabic: "أكتوبر",
      sentence: "Halloween is in October.",
      sentenceArabic: "الهالوين في أكتوبر.",
    },
    {
      english: "of",
      arabic: "من",
      sentence: "This is a picture of my family.",
      sentenceArabic: "هذه صورة لعائلتي.",
    },
    {
      english: "off",
      arabic: "بعيد",
      sentence: "Turn off the light, please.",
      sentenceArabic: "أطفئ الضوء من فضلك.",
    },
    {
      english: "office",
      arabic: "مكتب",
      sentence: "My father goes to the office every day.",
      sentenceArabic: "والدي يذهب إلى المكتب كل يوم.",
    },
    {
      english: "often",
      arabic: "غالباً",
      sentence: "I often go to the park.",
      sentenceArabic: "أذهب إلى الحديقة غالباً.",
    },
    {
      english: "oh",
      arabic: "أوه",
      sentence: "Oh, I see!",
      sentenceArabic: "أوه، فهمت!",
    },
    {
      english: "OK",
      arabic: "حسناً",
      sentence: "OK, I understand.",
      sentenceArabic: "حسناً، أنا أفهم.",
    },
    {
      english: "old",
      arabic: "قديم",
      sentence: "This is an old book.",
      sentenceArabic: "هذا كتاب قديم.",
    },
    {
      english: "on",
      arabic: "على",
      sentence: "The book is on the table.",
      sentenceArabic: "الكتاب على الطاولة.",
    },
    {
      english: "one",
      arabic: "واحد",
      sentence: "I have one brother.",
      sentenceArabic: "لدي أخ واحد.",
    },
    {
      english: "onion",
      arabic: "بصل",
      sentence: "I add onion to the salad.",
      sentenceArabic: "أضيف البصل إلى السلطة.",
    },
    {
      english: "online",
      arabic: "عبر الإنترنت",
      sentence: "I study English online.",
      sentenceArabic: "أدرس الإنجليزية عبر الإنترنت.",
    },
    {
      english: "only",
      arabic: "فقط",
      sentence: "I have only one book.",
      sentenceArabic: "لدي كتاب واحد فقط.",
    },
    {
      english: "open",
      arabic: "يفتح",
      sentence: "Open the door, please.",
      sentenceArabic: "افتح الباب من فضلك.",
    },
    {
      english: "opinion",
      arabic: "رأي",
      sentence: "What is your opinion?",
      sentenceArabic: "ما هو رأيك؟",
    },
    {
      english: "opposite",
      arabic: "عكس",
      sentence: "The bank is opposite the post office.",
      sentenceArabic: "البنك عكس مكتب البريد.",
    },
    {
      english: "or",
      arabic: "أو",
      sentence: "Do you want tea or coffee?",
      sentenceArabic: "هل تريد شاي أم قهوة؟",
    },
    {
      english: "orange",
      arabic: "برتقال",
      sentence: "I eat an orange for breakfast.",
      sentenceArabic: "آكل برتقالة على الإفطار.",
    },
    {
      english: "order",
      arabic: "يطلب",
      sentence: "I order pizza for dinner.",
      sentenceArabic: "أطلب البيتزا للعشاء.",
    },
    {
      english: "other",
      arabic: "آخر",
      sentence: "Do you have other books?",
      sentenceArabic: "هل لديك كتب أخرى؟",
    },
    {
      english: "our",
      arabic: "نا",
      sentence: "This is our house.",
      sentenceArabic: "هذا هو منزلنا.",
    },
    {
      english: "out",
      arabic: "خارج",
      sentence: "The cat is out.",
      sentenceArabic: "القطة في الخارج.",
    },
    {
      english: "over",
      arabic: "فوق",
      sentence: "The plane flies over the city.",
      sentenceArabic: "الطائرة تحلق فوق المدينة.",
    },
    {
      english: "purple",
      arabic: "بنفسجي",
      sentence: "She wears a purple dress.",
      sentenceArabic: "هي ترتدي فستاناً بنفسجياً.",
    },
    {
      english: "put",
      arabic: "يضع",
      sentence: "Put the book on the table, please.",
      sentenceArabic: "ضع الكتاب على الطاولة من فضلك.",
    },
    {
      english: "quarter",
      arabic: "ربع",
      sentence: "A quarter of an hour is 15 minutes.",
      sentenceArabic: "ربع ساعة هو 15 دقيقة.",
    },
    {
      english: "quick",
      arabic: "سريع",
      sentence: "He is a quick runner.",
      sentenceArabic: "هو عداء سريع.",
    },
    {
      english: "quickly",
      arabic: "بسرعة",
      sentence: "Please come quickly.",
      sentenceArabic: "من فضلك تعال بسرعة.",
    },
    {
      english: "quiet",
      arabic: "هادئ",
      sentence: "The library is quiet.",
      sentenceArabic: "المكتبة هادئة.",
    },
    {
      english: "quite",
      arabic: "تماماً",
      sentence: "I am quite tired.",
      sentenceArabic: "أنا tired تماماً.",
    },
    {
      english: "radio",
      arabic: "راديو",
      sentence: "I listen to the radio in the car.",
      sentenceArabic: "أستمع إلى الراديو في السيارة.",
    },
    {
      english: "rain",
      arabic: "مطر",
      sentence: "It rains a lot in April.",
      sentenceArabic: "تمطر كثيراً في أبريل.",
    },
    {
      english: "read",
      arabic: "يقرأ",
      sentence: "I read books every day.",
      sentenceArabic: "أقرأ الكتب كل يوم.",
    },

    {
      english: "terminal",
      arabic: "محطة",
      sentence: "The bus leaves from terminal 4.",
      sentenceArabic: "الحافلة تغادر من المحطة رقم 4.",
    },
    {
      english: "match",
      arabic: "مباراة",
      sentence: "We won the football match yesterday.",
      sentenceArabic: "فزنا بمباراة كرة القدم أمس.",
    },
    {
      english: "light",
      arabic: "ضوء",
      sentence: "Could you turn on the light, please?",
      sentenceArabic: "هل يمكنك تشغيل الضوء من فضلك؟",
    },
    {
      english: "like",
      arabic: "يحب",
      sentence: "I like to drink coffee in the morning.",
      sentenceArabic: "أحب أن أشرب القهوة في الصباح.",
    },
    {
      english: "double",
      arabic: "مزدوج",
      sentence: "I booked a double room at the hotel.",
      sentenceArabic: "حجزت غرفة مزدوجة في الفندق.",
    },
    {
      english: "August",
      arabic: "أغسطس",
      sentence: "We are going on vacation in August.",
      sentenceArabic: "سنذهب في إجازة في شهر أغسطس.",
    },
    {
      english: "aunt",
      arabic: "عمة / خالة",
      sentence: "My aunt is coming to visit us next week.",
      sentenceArabic: "عمتي ستأتي لزيارتنا الأسبوع المقبل.",
    },
    {
      english: "autumn",
      arabic: "الخريف",
      sentence: "The leaves change color in autumn.",
      sentenceArabic: "يتغير لون أوراق الشجر في الخريف.",
    },
    {
      english: "away",
      arabic: "بعيدًا",
      sentence: "Please put the toys away.",
      sentenceArabic: "من فضلك ضع الألعاب بعيدًا.",
    },
    {
      english: "baby",
      arabic: "رضيع",
      sentence: "The baby is sleeping in his crib.",
      sentenceArabic: "الرضيع نائم في سريره.",
    },
    {
      english: "bad",
      arabic: "سيء",
      sentence: "Eating too much sugar is bad for you.",
      sentenceArabic: "تناول الكثير من السكر سيء لصحتك.",
    },
    {
      english: "bag",
      arabic: "حقيبة",
      sentence: "I carry my books in a bag.",
      sentenceArabic: "أحمل كتبي في حقيبة.",
    },
    {
      english: "ball",
      arabic: "كرة",
      sentence: "The children are playing with a red ball.",
      sentenceArabic: "الأطفال يلعبون بكرة حمراء.",
    },
    {
      english: "banana",
      arabic: "موز",
      sentence: "A banana is a healthy snack.",
      sentenceArabic: "الموز وجبة خفيفة صحية.",
    },
    {
      english: "band",
      arabic: "فرقة موسيقية",
      sentence: "My favorite band is playing a concert tonight.",
      sentenceArabic: "فرقتي المفضلة ستقيم حفلاً الليلة.",
    },
    {
      english: "bank",
      arabic: "بنك",
      sentence: "I need to go to the bank to deposit some money.",
      sentenceArabic: "أحتاج للذهاب إلى البنك لإيداع بعض المال.",
    },
    {
      english: "bath",
      arabic: "حمام",
      sentence: "I like to take a warm bath after a long day.",
      sentenceArabic: "أحب أن آخذ حمامًا دافئًا بعد يوم طويل.",
    },
    {
      english: "bathroom",
      arabic: "دورة مياه",
      sentence: "Excuse me, where is the bathroom?",
      sentenceArabic: "معذرة، أين دورة المياه؟",
    },
    {
      english: "beautiful",
      arabic: "جميل",
      sentence: "The sunset over the ocean is beautiful.",
      sentenceArabic: "غروب الشمس فوق المحيط جميل.",
    },
    {
      english: "because",
      arabic: "لأن",
      sentence: "I am tired because I did not sleep well.",
      sentenceArabic: "أنا متعب لأنني لم أنم جيدًا.",
    },
  ],
  A2: [
    {
      english: "attend",
      arabic: "يحضر",
      sentence: "Are you going to attend the meeting tomorrow?",
      sentenceArabic: "هل ستحضر الاجتماع غدًا؟",
    },
    {
      english: "attention",
      arabic: "انتباه",
      sentence: "Please pay attention to the teacher.",
      sentenceArabic: "من فضلكم انتبهوا للمعلم.",
    },
    {
      english: "attractive",
      arabic: "جذاب",
      sentence: "She wore a very attractive dress to the party.",
      sentenceArabic: "لقد ارتدت فستانًا جذابًا جدًا في الحفلة.",
    },
    {
      english: "audience",
      arabic: "جمهور",
      sentence: "The audience clapped loudly after the performance.",
      sentenceArabic: "صفق الجمهور بحرارة بعد العرض.",
    },
    {
      english: "author",
      arabic: "مؤلف",
      sentence: "The author of this book is very famous.",
      sentenceArabic: "مؤلف هذا الكتاب مشهور جدًا.",
    },
    {
      english: "available",
      arabic: "متاح",
      sentence: "Are there any rooms available at the hotel?",
      sentenceArabic: "هل هناك أي غرف متاحة في الفندق؟",
    },
    {
      english: "avoid",
      arabic: "يتجنب",
      sentence: "You should avoid eating too much fast food.",
      sentenceArabic: "يجب عليك تجنب تناول الكثير من الوجبات السريعة.",
    },
    {
      english: "awful",
      arabic: "فظيع",
      sentence: "The weather was awful, so we stayed inside.",
      sentenceArabic: "كان الطقس فظيعًا، لذلك بقينا في الداخل.",
    },
    {
      english: "background",
      arabic: "خلفية",
      sentence: "He has a strong background in science.",
      sentenceArabic: "لديه خلفية قوية في العلوم.",
    },
    {
      english: "badly",
      arabic: "بشكل سيء",
      sentence: "The team played badly and lost the game.",
      sentenceArabic: "لعب الفريق بشكل سيء وخسر المباراة.",
    },
    {
      english: "baseball",
      arabic: "بيسبول",
      sentence: "Baseball is a very popular sport in the United States.",
      sentenceArabic: "البيسبول رياضة شائعة جدًا في الولايات المتحدة.",
    },
    {
      english: "based",
      arabic: "مبني على",
      sentence: "The film is based on a true story.",
      sentenceArabic: "الفيلم مبني على قصة حقيقية.",
    },
    {
      english: "basketball",
      arabic: "كرة السلة",
      sentence: "He is very tall and plays basketball for his school.",
      sentenceArabic: "إنه طويل جدًا ويلعب كرة السلة لمدرسته.",
    },
    {
      english: "bean",
      arabic: "فول",
      sentence: "I like to eat beans with rice.",
      sentenceArabic: "أحب أن آكل الفول مع الأرز.",
    },
    {
      english: "bear",
      arabic: "دب",
      sentence: "We saw a large bear in the national park.",
      sentenceArabic: "رأينا دبًا كبيرًا في الحديقة الوطنية.",
    },
    {
      english: "beef",
      arabic: "لحم بقري",
      sentence: "For dinner, we are having roast beef.",
      sentenceArabic: "سنتناول لحمًا بقريًا مشويًا على العشاء.",
    },
    {
      english: "thought",
      arabic: "فكرة",
      sentence: "That is an interesting thought.",
      sentenceArabic: "تلك فكرة مثيرة للاهتمام.",
    },
    {
      english: "throw",
      arabic: "يرمي",
      sentence: "Please throw the ball back to me.",
      sentenceArabic: "من فضلك ارمِ الكرة إليّ مرة أخرى.",
    },
    {
      english: "tidy",
      arabic: "مرتب",
      sentence: "You should keep your room tidy.",
      sentenceArabic: "يجب أن تحافظ على غرفتك مرتبة.",
    },
    {
      english: "reader",
      arabic: "قارئ",
      sentence: "I am a fast reader.",
      sentenceArabic: "أنا قارئ سريع.",
    },
    {
      english: "reading",
      arabic: "قراءة",
      sentence: "Reading is my hobby.",
      sentenceArabic: "القراءة هي هوايتي.",
    },
    {
      english: "September",
      arabic: "سبتمبر",
      sentence: "School starts in September.",
      sentenceArabic: "المدرسة تبدأ في سبتمبر.",
    },
    {
      english: "seven",
      arabic: "سبعة",
      sentence: "I have seven days in a week.",
      sentenceArabic: "لدي سبعة أيام في الأسبوع.",
    },
    {
      english: "seventeen",
      arabic: "سبعة عشر",
      sentence: "My sister is seventeen years old.",
      sentenceArabic: "أختي تبلغ من العمر سبعة عشر عاماً.",
    },
    {
      english: "seventy",
      arabic: "سبعون",
      sentence: "My grandfather is seventy years old.",
      sentenceArabic: "جدي يبلغ من العمر سبعين عاماً.",
    },
    {
      english: "she",
      arabic: "هي",
      sentence: "She is my friend.",
      sentenceArabic: "هي صديقتي.",
    },
    {
      english: "sheep",
      arabic: "خروف",
      sentence: "The sheep gives us wool.",
      sentenceArabic: "الخروف يعطينا الصوف.",
    },
    {
      english: "shirt",
      arabic: "قميص",
      sentence: "I wear a blue shirt.",
      sentenceArabic: "أرتدي قميصاً أزرق.",
    },
    {
      english: "shoe",
      arabic: "حذاء",
      sentence: "I buy new shoes.",
      sentenceArabic: "أشتري أحذية جديدة.",
    },
    {
      english: "shop",
      arabic: "متجر",
      sentence: "I go to the shop to buy food.",
      sentenceArabic: "أذهب إلى المتجر لشراء الطعام.",
    },
    {
      english: "shopping",
      arabic: "تسوق",
      sentence: "I go shopping on weekends.",
      sentenceArabic: "أذهب للتسوق في عطلة نهاية الأسبوع.",
    },
    {
      english: "short",
      arabic: "قصير",
      sentence: "He is short.",
      sentenceArabic: "هو قصير.",
    },
    {
      english: "should",
      arabic: "يجب",
      sentence: "You should study more.",
      sentenceArabic: "يجب أن تدرس أكثر.",
    },
    {
      english: "show",
      arabic: "يعرض",
      sentence: "Can you show me the way?",
      sentenceArabic: "هل يمكنك أن تريني الطريق؟",
    },
    {
      english: "shower",
      arabic: "دش",
      sentence: "I take a shower every morning.",
      sentenceArabic: "أستحم كل صباح.",
    },
    {
      english: "sick",
      arabic: "مريض",
      sentence: "I am sick today.",
      sentenceArabic: "أنا مريض اليوم.",
    },
    {
      english: "similar",
      arabic: "مشابه",
      sentence: "These two books are similar.",
      sentenceArabic: "هذان الكتابان متشابهان.",
    },
    {
      english: "ago",
      arabic: "منذ",
      sentence: "I saw him two days ago.",
      sentenceArabic: "رأيته منذ يومين.",
    },
    {
      english: "agree",
      arabic: "يوافق",
      sentence: "I agree with you.",
      sentenceArabic: "أوافقك الرأي.",
    },
    {
      english: "air",
      arabic: "هواء",
      sentence: "We need air to breathe.",
      sentenceArabic: "نحتاج الهواء للتنفس.",
    },
    {
      english: "airport",
      arabic: "مطار",
      sentence: "We go to the airport by taxi.",
      sentenceArabic: "نذهب إلى المطار by taxi.",
    },
    {
      english: "also",
      arabic: "أيضاً",
      sentence: "I also like coffee.",
      sentenceArabic: "أنا أيضاً أحب القهوة.",
    },
    {
      english: "always",
      arabic: "دائماً",
      sentence: "I always brush my teeth.",
      sentenceArabic: "أنا always أفرش أسناني.",
    },
    {
      english: "amazing",
      arabic: "مذهل",
      sentence: "The view is amazing.",
      sentenceArabic: "المنظر مذهل.",
    },
    {
      english: "and",
      arabic: "و",
      sentence: "I like tea and coffee.",
      sentenceArabic: "أحب الشاي والقهوة.",
    },
    {
      english: "angry",
      arabic: "غاضب",
      sentence: "He is angry.",
      sentenceArabic: "هو غاضب.",
    },
    {
      english: "animal",
      arabic: "حيوان",
      sentence: "The lion is an animal.",
      sentenceArabic: "الأسد حيوان.",
    },
    {
      english: "another",
      arabic: "آخر",
      sentence: "Can I have another cup of tea?",
      sentenceArabic: "هل يمكنني الحصول على another فنجان من الشاي؟",
    },
    {
      english: "answer",
      arabic: "إجابة",
      sentence: "What is the answer?",
      sentenceArabic: "ما هي الإجابة؟",
    },
    {
      english: "anyone",
      arabic: "أي أحد",
      sentence: "Can anyone help me?",
      sentenceArabic: "هل يمكن لأي أحد مساعدتي؟",
    },
    {
      english: "anything",
      arabic: "أي شيء",
      sentence: "You can ask me anything.",
      sentenceArabic: "يمكنك أن تسألني أي شيء.",
    },
    {
      english: "street",
      arabic: "شارع",
      sentence: "I live on a quiet street.",
      sentenceArabic: "أعيش في شارع هادئ.",
    },
    {
      english: "strong",
      arabic: "قوي",
      sentence: "He is very strong.",
      sentenceArabic: "هو قوي جداً.",
    },
    {
      english: "student",
      arabic: "طالب",
      sentence: "I am a student.",
      sentenceArabic: "أنا طالب.",
    },
    {
      english: "study",
      arabic: "يدرس",
      sentence: "I study English.",
      sentenceArabic: "أدرس الإنجليزية.",
    },
    {
      english: "style",
      arabic: "نمط",
      sentence: "I like your style.",
      sentenceArabic: "أحب نمطك.",
    },
    {
      english: "success",
      arabic: "نجاح",
      sentence: "Hard work leads to success.",
      sentenceArabic: "العمل الجاد leads إلى النجاح.",
    },
    {
      english: "sugar",
      arabic: "سكر",
      sentence: "I add sugar to my tea.",
      sentenceArabic: "أضيف السكر إلى شايي.",
    },
    {
      english: "summer",
      arabic: "صيف",
      sentence: "It is hot in summer.",
      sentenceArabic: "الجو حار في الصيف.",
    },
    {
      english: "sun",
      arabic: "شمس",
      sentence: "The sun is bright.",
      sentenceArabic: "الشمس مشرقة.",
    },
    {
      english: "Sunday",
      arabic: "الأحد",
      sentence: "We rest on Sunday.",
      sentenceArabic: "نرتاح يوم الأحد.",
    },
    {
      english: "supermarket",
      arabic: "سوبرماركت",
      sentence: "I buy food from the supermarket.",
      sentenceArabic: "أشتري الطعام من السوبرماركت.",
    },
    {
      english: "sweater",
      arabic: "سترة",
      sentence: "I wear a sweater in winter.",
      sentenceArabic: "أرتدي سترة في الشتاء.",
    },
    {
      english: "swimming",
      arabic: "سباحة",
      sentence: "I like swimming.",
      sentenceArabic: "أحب السباحة.",
    },
    {
      english: "up",
      arabic: "أعلى",
      sentence: "Look up!",
      sentenceArabic: "انظر إلى الأعلى!",
    },
    {
      english: "us",
      arabic: "نا",
      sentence: "She helps us.",
      sentenceArabic: "هي تساعدنا.",
    },
    {
      english: "useful",
      arabic: "مفيد",
      sentence: "This book is useful.",
      sentenceArabic: "هذا الكتاب مفيد.",
    },
    {
      english: "usually",
      arabic: "عادة",
      sentence: "I usually get up at 7 AM.",
      sentenceArabic: "عادةً ما أستيقظ عند الساعة 7 صباحاً.",
    },
    {
      english: "vacation",
      arabic: "إجازة",
      sentence: "We go on vacation in summer.",
      sentenceArabic: "نذهب في إجازة في الصيف.",
    },
    {
      english: "vegetable",
      arabic: "خضار",
      sentence: "I eat vegetables every day.",
      sentenceArabic: "آكل الخضار كل يوم.",
    },
    {
      english: "video",
      arabic: "فيديو",
      sentence: "I watch videos on YouTube.",
      sentenceArabic: "أشاهد الفيديوهات on YouTube.",
    },
    {
      english: "village",
      arabic: "قرية",
      sentence: "My grandparents live in a village.",
      sentenceArabic: "جداي يعيشان في قرية.",
    },
    {
      english: "visit",
      arabic: "يزور",
      sentence: "I visit my friends every weekend.",
      sentenceArabic: "أزور أصدقائي كل نهاية أسبوع.",
    },
    {
      english: "visitor",
      arabic: "زائر",
      sentence: "We have visitors today.",
      sentenceArabic: "لدينا زوار اليوم.",
    },
    {
      english: "waiter",
      arabic: "نادل",
      sentence: "The waiter brings our food.",
      sentenceArabic: "النادل يجلب طعامنا.",
    },
    {
      english: "wake",
      arabic: "يستيقظ",
      sentence: "I wake up at 7 AM.",
      sentenceArabic: "أستيقظ عند الساعة 7 صباحاً.",
    },
    {
      english: "walk",
      arabic: "يمشي",
      sentence: "I walk to school.",
      sentenceArabic: "أمشي إلى المدرسة.",
    },
    {
      english: "wall",
      arabic: "حائط",
      sentence: "There is a picture on the wall.",
      sentenceArabic: "هناك صورة على الحائط.",
    },
    {
      english: "bread",
      arabic: "خبز",
      sentence: "I eat bread for breakfast.",
      sentenceArabic: "آكل الخبز على الإفطار.",
    },
    {
      english: "break",
      arabic: "يكسر",
      sentence: "Don't break the glass.",
      sentenceArabic: "لا تكسر الزجاج.",
    },
    {
      english: "breakfast",
      arabic: "فطور",
      sentence: "I eat breakfast at 8 AM.",
      sentenceArabic: "آكل الفطور عند الساعة 8 صباحاً.",
    },
    {
      english: "bring",
      arabic: "يجلب",
      sentence: "Bring me a glass of water, please.",
      sentenceArabic: "أحضر لي كوباً من الماء من فضلك.",
    },
    {
      english: "brother",
      arabic: "أخ",
      sentence: "My brother is older than me.",
      sentenceArabic: "أخي أكبر مني.",
    },
    {
      english: "brown",
      arabic: "بني",
      sentence: "I have brown eyes.",
      sentenceArabic: "لدي عيون بنية.",
    },
    {
      english: "build",
      arabic: "يبني",
      sentence: "They build a new house.",
      sentenceArabic: "هم يبنون منزلاً جديداً.",
    },
    {
      english: "building",
      arabic: "مبنى",
      sentence: "This is a tall building.",
      sentenceArabic: "هذا مبنى طويل.",
    },
    {
      english: "bus",
      arabic: "حافلة",
      sentence: "I take the bus to school.",
      sentenceArabic: "أخذ الحافلة إلى المدرسة.",
    },
    {
      english: "business",
      arabic: "عمل",
      sentence: "My father has his own business.",
      sentenceArabic: "والدي لديه عمله الخاص.",
    },
    {
      english: "busy",
      arabic: "مشغول",
      sentence: "I am busy today.",
      sentenceArabic: "أنا مشغول اليوم.",
    },
    {
      english: "butter",
      arabic: "زبدة",
      sentence: "I put butter on my bread.",
      sentenceArabic: "أضع الزبدة على خبزي.",
    },
    {
      english: "buy",
      arabic: "يشتري",
      sentence: "I buy books from the bookstore.",
      sentenceArabic: "أشتري الكتب من مكتبة الكتب.",
    },
    {
      english: "bye",
      arabic: "وداعاً",
      sentence: "Bye, see you tomorrow!",
      sentenceArabic: "وداعاً، أراك غداً!",
    },
    {
      english: "cafe",
      arabic: "مقهى",
      sentence: "We meet at the cafe.",
      sentenceArabic: "نلتقي في المقهى.",
    },
    {
      english: "cake",
      arabic: "كعكة",
      sentence: "I eat cake on my birthday.",
      sentenceArabic: "آكل الكعكة في عيد ميلادي.",
    },
    {
      english: "call",
      arabic: "يتصل",
      sentence: "I call my mother every day.",
      sentenceArabic: "أتصل بأمي كل يوم.",
    },
    {
      english: "camera",
      arabic: "كاميرا",
      sentence: "I take photos with my camera.",
      sentenceArabic: "ألتقط الصور بكاميرتي.",
    },
    {
      english: "can",
      arabic: "يستطيع",
      sentence: "I can speak English.",
      sentenceArabic: "أستطيع التحدث بالإنجليزية.",
    },
    {
      english: "cannot",
      arabic: "لا يستطيع",
      sentence: "I cannot swim.",
      sentenceArabic: "أنا لا أستطيع السباحة.",
    },
    {
      english: "capital",
      arabic: "عاصمة",
      sentence: "London is the capital of England.",
      sentenceArabic: "لندن هي عاصمة إنجلترا.",
    },
    {
      english: "car",
      arabic: "سيارة",
      sentence: "We go by car.",
      sentenceArabic: "نذهب by car.",
    },
    {
      english: "card",
      arabic: "بطاقة",
      sentence: "I have a credit card.",
      sentenceArabic: "لدي بطاقة ائتمان.",
    },
    {
      english: "career",
      arabic: "مهنة",
      sentence: "Teaching is my career.",
      sentenceArabic: "التدريس هو مهنتي.",
    },
    {
      english: "country",
      arabic: "بلد",
      sentence: "I love my country.",
      sentenceArabic: "أحب بلدي.",
    },
    {
      english: "course",
      arabic: "دورة",
      sentence: "I take an English course.",
      sentenceArabic: "أخذ دورة في اللغة الإنجليزية.",
    },
    {
      english: "cousin",
      arabic: "ابن عم",
      sentence: "My cousin lives in London.",
      sentenceArabic: "ابن عمي يعيش في لندن.",
    },
    {
      english: "cow",
      arabic: "بقرة",
      sentence: "The cow gives us milk.",
      sentenceArabic: "البقرة تعطينا الحليب.",
    },
    {
      english: "create",
      arabic: "يخلق",
      sentence: "Artists create beautiful paintings.",
      sentenceArabic: "الفنانون يخلقون لوحات جميلة.",
    },
    {
      english: "culture",
      arabic: "ثقافة",
      sentence: "I learn about different cultures.",
      sentenceArabic: "أتعلم عن الثقافات المختلفة.",
    },
    {
      english: "cup",
      arabic: "كوب",
      sentence: "I drink tea from a cup.",
      sentenceArabic: "أشرب الشاي من كوب.",
    },
    {
      english: "customer",
      arabic: "زبون",
      sentence: "The customer is always right.",
      sentenceArabic: "الزبون دائماً على حق.",
    },
    {
      english: "dad",
      arabic: "أب",
      sentence: "My dad is a teacher.",
      sentenceArabic: "والدي مدرس.",
    },
    {
      english: "dance",
      arabic: "يرقص",
      sentence: "I like to dance.",
      sentenceArabic: "أحب أن أرقص.",
    },
    {
      english: "dancer",
      arabic: "راقص",
      sentence: "She is a professional dancer.",
      sentenceArabic: "هي راقصة محترفة.",
    },
    {
      english: "dancing",
      arabic: "رقص",
      sentence: "Dancing is fun.",
      sentenceArabic: "الرقص ممتع.",
    },
    {
      english: "dangerous",
      arabic: "خطير",
      sentence: "Fire is dangerous.",
      sentenceArabic: "النار خطيرة.",
    },
    {
      english: "daughter",
      arabic: "ابنة",
      sentence: "My daughter is five years old.",
      sentenceArabic: "ابنتي تبلغ من العمر خمس سنوات.",
    },
    {
      english: "day",
      arabic: "يوم",
      sentence: "There are 24 hours in a day.",
      sentenceArabic: "هناك 24 ساعة في اليوم.",
    },
    {
      english: "enjoy",
      arabic: "يستمتع",
      sentence: "I enjoy reading books.",
      sentenceArabic: "أستمتع بقراءة الكتب.",
    },
    {
      english: "enough",
      arabic: "كاف",
      sentence: "I have enough money.",
      sentenceArabic: "لدي enough المال.",
    },
    {
      english: "euro",
      arabic: "يورو",
      sentence: "I pay in euros.",
      sentenceArabic: "أدفع باليورو.",
    },
    {
      english: "evening",
      arabic: "مساء",
      sentence: "I watch TV in the evening.",
      sentenceArabic: "أشاهد التلفاز في المساء.",
    },
    {
      english: "event",
      arabic: "حدث",
      sentence: "This is an important event.",
      sentenceArabic: "هذا حدث مهم.",
    },
    {
      english: "ever",
      arabic: "أبداً",
      sentence: "Have you ever been to Paris?",
      sentenceArabic: "هل سبق لك أن كنت في باريس؟",
    },
    {
      english: "every",
      arabic: "كل",
      sentence: "I exercise every day.",
      sentenceArabic: "أتمرن كل يوم.",
    },
    {
      english: "everybody",
      arabic: "الجميع",
      sentence: "Everybody likes music.",
      sentenceArabic: "الجميع يحب الموسيقى.",
    },
    {
      english: "everyone",
      arabic: "الجميع",
      sentence: "Everyone is here.",
      sentenceArabic: "الجميع هنا.",
    },
    {
      english: "everything",
      arabic: "كل شيء",
      sentence: "Everything is fine.",
      sentenceArabic: "كل شيء على ما يرام.",
    },
    {
      english: "exam",
      arabic: "امتحان",
      sentence: "I have an exam tomorrow.",
      sentenceArabic: "لدي امتحان غداً.",
    },
    {
      english: "example",
      arabic: "مثال",
      sentence: "This is an example.",
      sentenceArabic: "هذا مثال.",
    },
    {
      english: "excited",
      arabic: "متحمس",
      sentence: "I am excited about the trip.",
      sentenceArabic: "أنا متحمس regarding الرحلة.",
    },
    {
      english: "exciting",
      arabic: "مثير",
      sentence: "This is an exciting movie.",
      sentenceArabic: "هذا فيلم مثير.",
    },
    {
      english: "exercise",
      arabic: "تمرين",
      sentence: "I do exercise every morning.",
      sentenceArabic: "أقوم بالتمرين every morning.",
    },
    {
      english: "give",
      arabic: "يعطي",
      sentence: "Please give me the book.",
      sentenceArabic: "من فضلك أعطني الكتاب.",
    },
    {
      english: "glass",
      arabic: "زجاج",
      sentence: "I drink water from a glass.",
      sentenceArabic: "أشرب الماء من كوب زجاجي.",
    },
    {
      english: "goodbye",
      arabic: "وداعاً",
      sentence: "Goodbye, see you soon!",
      sentenceArabic: "وداعاً، أراك قريباً!",
    },
    {
      english: "grandfather",
      arabic: "جد",
      sentence: "My grandfather is old.",
      sentenceArabic: "جدي كبير في السن.",
    },
    {
      english: "grandmother",
      arabic: "جدة",
      sentence: "My grandmother makes delicious food.",
      sentenceArabic: "جدتي تصنع طعاماً لذيذاً.",
    },
    {
      english: "grandparent",
      arabic: "جد",
      sentence: "I visit my grandparents every weekend.",
      sentenceArabic: "أزور جدي every weekend.",
    },
    {
      english: "great",
      arabic: "عظيم",
      sentence: "That's a great idea!",
      sentenceArabic: "هذه فكرة عظيمة!",
    },
    {
      english: "green",
      arabic: "أخضر",
      sentence: "The grass is green.",
      sentenceArabic: "العشب أخضر.",
    },
    {
      english: "grey",
      arabic: "رمادي",
      sentence: "The sky is grey today.",
      sentenceArabic: "السماء رمادية اليوم.",
    },
    {
      english: "group",
      arabic: "مجموعة",
      sentence: "We work in a group.",
      sentenceArabic: "نعمل في مجموعة.",
    },
    {
      english: "grow",
      arabic: "ينمو",
      sentence: "Plants grow with water and sun.",
      sentenceArabic: "النباتات تنمو with الماء والشمس.",
    },
    {
      english: "guess",
      arabic: "خمن",
      sentence: "Can you guess my age?",
      sentenceArabic: "هل يمكنك أن تخمن عمري؟",
    },
    {
      english: "guitar",
      arabic: "غيتار",
      sentence: "I play the guitar.",
      sentenceArabic: "أعزف على الغيتار.",
    },
    {
      english: "gym",
      arabic: "نادي رياضي",
      sentence: "I go to the gym every day.",
      sentenceArabic: "أذهب إلى النادي الرياضي every day.",
    },
    {
      english: "hair",
      arabic: "شعر",
      sentence: "She has long hair.",
      sentenceArabic: "لديها شعر طويل.",
    },
    {
      english: "happen",
      arabic: "يحدث",
      sentence: "What happened?",
      sentenceArabic: "ماذا happened؟",
    },
    {
      english: "happy",
      arabic: "سعيد",
      sentence: "I am happy today.",
      sentenceArabic: "أنا سعيد اليوم.",
    },
    {
      english: "hard",
      arabic: "صعب",
      sentence: "This exercise is hard.",
      sentenceArabic: "هذا التمرين صعب.",
    },
    {
      english: "hat",
      arabic: "قبعة",
      sentence: "I wear a hat in summer.",
      sentenceArabic: "أرتدي قبعة في الصيف.",
    },
    {
      english: "have",
      arabic: "يملك",
      sentence: "I have a book.",
      sentenceArabic: "لدي كتاب.",
    },
    {
      english: "he",
      arabic: "هو",
      sentence: "He is my brother.",
      sentenceArabic: "هو أخي.",
    },
    {
      english: "health",
      arabic: "صحة",
      sentence: "Health is important.",
      sentenceArabic: "الصحة مهمة.",
    },
    {
      english: "healthy",
      arabic: "صحي",
      sentence: "I eat healthy food.",
      sentenceArabic: "أأكل طعاماً صحياً.",
    },
    {
      english: "June",
      arabic: "يونيو",
      sentence: "Summer begins in June.",
      sentenceArabic: "الصيف يبدأ في يونيو.",
    },
    {
      english: "just",
      arabic: "فقط",
      sentence: "I just arrived.",
      sentenceArabic: "لقد وصلت للتو.",
    },
    {
      english: "keep",
      arabic: "يحتفظ",
      sentence: "Keep this book, please.",
      sentenceArabic: "احتفظ بهذا الكتاب من فضلك.",
    },
    {
      english: "kilometre",
      arabic: "كيلومتر",
      sentence: "I walk two kilometres every day.",
      sentenceArabic: "أمشي كيلومترين every day.",
    },
    {
      english: "kind",
      arabic: "لطيف",
      sentence: "She is very kind.",
      sentenceArabic: "هي very لطيفة.",
    },
    {
      english: "kitchen",
      arabic: "مطبخ",
      sentence: "I cook in the kitchen.",
      sentenceArabic: "أطبخ في المطبخ.",
    },
    {
      english: "know",
      arabic: "يعرف",
      sentence: "I know the answer.",
      sentenceArabic: "أعرف الإجابة.",
    },
    {
      english: "language",
      arabic: "لغة",
      sentence: "English is a global language.",
      sentenceArabic: "الإنجليزية هي لغة global.",
    },
    {
      english: "large",
      arabic: "كبير",
      sentence: "This is a large room.",
      sentenceArabic: "هذه غرفة كبيرة.",
    },
    {
      english: "late",
      arabic: "متأخر",
      sentence: "I am late for school.",
      sentenceArabic: "أنا متأخر للمدرسة.",
    },
    {
      english: "laugh",
      arabic: "يضحك",
      sentence: "I laugh at funny jokes.",
      sentenceArabic: "أضحك على النكات المضحكة.",
    },
    {
      english: "learn",
      arabic: "يتعلم",
      sentence: "I learn new words every day.",
      sentenceArabic: "أتعلم كلمات جديدة every day.",
    },
    {
      english: "left",
      arabic: "يسار",
      sentence: "Turn left at the corner.",
      sentenceArabic: "انعطف يساراً at الزاوية.",
    },
    {
      english: "leg",
      arabic: "رجل",
      sentence: "My leg hurts.",
      sentenceArabic: "رجلي تؤلمني.",
    },
    {
      english: "near",
      arabic: "قريب",
      sentence: "The school is near my house.",
      sentenceArabic: "المدرسة قريبة من بيتي.",
    },
    {
      english: "neighbour",
      arabic: "جار",
      sentence: "My neighbour is friendly.",
      sentenceArabic: "جاري ودود.",
    },
    {
      english: "never",
      arabic: "أبداً",
      sentence: "I never lie.",
      sentenceArabic: "أنا never أكذب.",
    },
    {
      english: "new",
      arabic: "جديد",
      sentence: "I have a new book.",
      sentenceArabic: "لدي كتاب جديد.",
    },
    {
      english: "news",
      arabic: "أخبار",
      sentence: "I watch the news every day.",
      sentenceArabic: "أشاهد الأخبار every day.",
    },
    {
      english: "newspaper",
      arabic: "جريدة",
      sentence: "I read the newspaper every morning.",
      sentenceArabic: "أقرأ الجريدة every morning.",
    },
    {
      english: "next",
      arabic: "التالي",
      sentence: "See you next week.",
      sentenceArabic: "أراك next week.",
    },
    {
      english: "nice",
      arabic: "لطيف",
      sentence: "She is a nice person.",
      sentenceArabic: "هي شخص لطيف.",
    },
    {
      english: "night",
      arabic: "ليل",
      sentence: "I sleep at night.",
      sentenceArabic: "أنام في الليل.",
    },
    {
      english: "nine",
      arabic: "تسعة",
      sentence: "I have nine books.",
      sentenceArabic: "لدي تسعة كتب.",
    },
    {
      english: "nineteen",
      arabic: "تسعة عشر",
      sentence: "My sister is nineteen years old.",
      sentenceArabic: "أختي تبلغ من العمر تسعة عشر عاماً.",
    },
    {
      english: "ninety",
      arabic: "تسعون",
      sentence: "My grandmother is ninety years old.",
      sentenceArabic: "جدتي تبلغ من العمر تسعين عاماً.",
    },
    {
      english: "no",
      arabic: "لا",
      sentence: "No, I don't want coffee.",
      sentenceArabic: "لا، أنا لا أريد قهوة.",
    },
    {
      english: "nobody",
      arabic: "لا أحد",
      sentence: "Nobody is here.",
      sentenceArabic: "لا أحد هنا.",
    },
    {
      english: "north",
      arabic: "شمال",
      sentence: "Canada is north of the USA.",
      sentenceArabic: "كندا north of الولايات المتحدة.",
    },
    {
      english: "nose",
      arabic: "أنف",
      sentence: "My nose is small.",
      sentenceArabic: "أنفي صغير.",
    },
    {
      english: "not",
      arabic: "ليس",
      sentence: "I am not tired.",
      sentenceArabic: "أنا لست متعباً.",
    },
    {
      english: "nothing",
      arabic: "لا شيء",
      sentence: "I have nothing to say.",
      sentenceArabic: "ليس لدي شيء لأقوله.",
    },
    {
      english: "November",
      arabic: "نوفمبر",
      sentence: "It gets cold in November.",
      sentenceArabic: "الجو becomes بارداً في نوفمبر.",
    },
    {
      english: "nurse",
      arabic: "ممرضة",
      sentence: "My sister is a nurse.",
      sentenceArabic: "أختي ممرضة.",
    },
    {
      english: "o’clock",
      arabic: "الساعة",
      sentence: "It is three o’clock.",
      sentenceArabic: "إنها الساعة الثالثة.",
    },
    {
      english: "potato",
      arabic: "بطاطس",
      sentence: "I like baked potatoes.",
      sentenceArabic: "أحب البطاطس baked.",
    },
    {
      english: "pound",
      arabic: "جنيه",
      sentence: "I need ten pounds.",
      sentenceArabic: "أحتاج إلى عشرة جنيهات.",
    },
    {
      english: "practice",
      arabic: "يمارس",
      sentence: "I practice English every day.",
      sentenceArabic: "أمارس الإنجليزية every day.",
    },
    {
      english: "practise",
      arabic: "يمارس",
      sentence: "I practise the piano every day.",
      sentenceArabic: "أمارس البيانو every day.",
    },
    {
      english: "prefer",
      arabic: "يفضل",
      sentence: "I prefer tea to coffee.",
      sentenceArabic: "أفضل الشاي على القهوة.",
    },
    {
      english: "prepare",
      arabic: "يحضر",
      sentence: "I prepare breakfast every morning.",
      sentenceArabic: "أحضر الفطور every morning.",
    },
    {
      english: "pretty",
      arabic: "جميل",
      sentence: "She is pretty.",
      sentenceArabic: "هي جميلة.",
    },
    {
      english: "probably",
      arabic: "probably",
      sentence: "I will probably come tomorrow.",
      sentenceArabic: "probably سآتي غداً.",
    },
    {
      english: "problem",
      arabic: "مشكلة",
      sentence: "I have a problem.",
      sentenceArabic: "لدي مشكلة.",
    },
    {
      english: "product",
      arabic: "منتج",
      sentence: "This is a good product.",
      sentenceArabic: "هذا منتج جيد.",
    },
    {
      english: "programme",
      arabic: "برنامج",
      sentence: "I watch this programme every week.",
      sentenceArabic: "أشاهد هذا البرنامج every week.",
    },
    {
      english: "sad",
      arabic: "حزين",
      sentence: "I am sad today.",
      sentenceArabic: "أنا حزين اليوم.",
    },
    {
      english: "salad",
      arabic: "سلطة",
      sentence: "I eat salad for lunch.",
      sentenceArabic: "آكل السلطة على الغداء.",
    },
    {
      english: "salt",
      arabic: "ملح",
      sentence: "I add salt to my food.",
      sentenceArabic: "أضيف الملح إلى طعامي.",
    },
    {
      english: "same",
      arabic: "نفس",
      sentence: "We have the same book.",
      sentenceArabic: "لدينا نفس الكتاب.",
    },
    {
      english: "sandwich",
      arabic: "ساندويتش",
      sentence: "I eat a sandwich for lunch.",
      sentenceArabic: "آكل ساندويتش على الغداء.",
    },
    {
      english: "Saturday",
      arabic: "السبت",
      sentence: "We relax on Saturday.",
      sentenceArabic: "نرتاح يوم السبت.",
    },
    {
      english: "say",
      arabic: "يقول",
      sentence: "What did you say?",
      sentenceArabic: "ماذا قلت؟",
    },
    {
      english: "school",
      arabic: "مدرسة",
      sentence: "I go to school every day.",
      sentenceArabic: "أذهب إلى المدرسة every day.",
    },
    {
      english: "science",
      arabic: "علم",
      sentence: "I study science at school.",
      sentenceArabic: "أدرس العلم في المدرسة.",
    },
    {
      english: "scientist",
      arabic: "عالم",
      sentence: "My father is a scientist.",
      sentenceArabic: "والدي عالم.",
    },
    {
      english: "sea",
      arabic: "بحر",
      sentence: "We swim in the sea.",
      sentenceArabic: "نسبح في البحر.",
    },
    {
      english: "section",
      arabic: "قسم",
      sentence: "This is the sports section.",
      sentenceArabic: "هذا قسم الرياضة.",
    },
    {
      english: "see",
      arabic: "يرى",
      sentence: "I see a bird.",
      sentenceArabic: "أرى طائراً.",
    },
    {
      english: "sell",
      arabic: "يبيع",
      sentence: "I sell old books.",
      sentenceArabic: "أبيع الكتب القديمة.",
    },
    {
      english: "send",
      arabic: "يرسل",
      sentence: "I send emails every day.",
      sentenceArabic: "أرسل رسائل بريد إلكتروني every day.",
    },
    {
      english: "a",
      arabic: "أ",
      sentence: "I have a book.",
      sentenceArabic: "لدي كتاب.",
    },
    {
      english: "about",
      arabic: "حول",
      sentence: "This book is about animals.",
      sentenceArabic: "هذا الكتاب about الحيوانات.",
    },
    {
      english: "above",
      arabic: "فوق",
      sentence: "The picture is above the door.",
      sentenceArabic: "الصورة above الباب.",
    },
    {
      english: "across",
      arabic: "عبر",
      sentence: "The bank is across the street.",
      sentenceArabic: "البنك across الشارع.",
    },
    {
      english: "action",
      arabic: "فعل",
      sentence: "Actions speak louder than words.",
      sentenceArabic: "الأفعال تتحدث louder من الكلمات.",
    },
    {
      english: "activity",
      arabic: "نشاط",
      sentence: "We have many activities at school.",
      sentenceArabic: "لدينا many الأنشطة في المدرسة.",
    },
    {
      english: "actor",
      arabic: "ممثل",
      sentence: "He is a famous actor.",
      sentenceArabic: "هو ممثل شهير.",
    },
    {
      english: "actress",
      arabic: "ممثلة",
      sentence: "She is a famous actress.",
      sentenceArabic: "هي ممثلة شهيرة.",
    },
    {
      english: "add",
      arabic: "يضيف",
      sentence: "Add sugar to your tea.",
      sentenceArabic: "أضف السكر إلى شايك.",
    },
    {
      english: "advice",
      arabic: "نصيحة",
      sentence: "Can you give me some advice?",
      sentenceArabic: "هل يمكنك أن تعطيني some النصيحة؟",
    },
    {
      english: "afraid",
      arabic: "خائف",
      sentence: "I am afraid of dogs.",
      sentenceArabic: "أنا خائف من الكلاب.",
    },
    {
      english: "afternoon",
      arabic: "بعد الظهر",
      sentence: "I take a nap in the afternoon.",
      sentenceArabic: "آخذ قيلولة in the بعد الظهر.",
    },
    {
      english: "again",
      arabic: "مرة أخرى",
      sentence: "See you again soon!",
      sentenceArabic: "أراك مرة أخرى قريباً!",
    },
    {
      english: "sound",
      arabic: "صوت",
      sentence: "I hear a sound.",
      sentenceArabic: "أسمع صوتاً.",
    },
    {
      english: "soup",
      arabic: "حساء",
      sentence: "I eat soup for dinner.",
      sentenceArabic: "آكل الحساء على العشاء.",
    },
    {
      english: "south",
      arabic: "جنوب",
      sentence: "South Africa is a country.",
      sentenceArabic: "جنوب أفريقيا هي دولة.",
    },
    {
      english: "space",
      arabic: "فضاء",
      sentence: "There is space in the room.",
      sentenceArabic: "هناك مساحة في الغرفة.",
    },
    {
      english: "speak",
      arabic: "يتحدث",
      sentence: "I speak English.",
      sentenceArabic: "أتحدث الإنجليزية.",
    },
    {
      english: "special",
      arabic: "خاص",
      sentence: "Today is a special day.",
      sentenceArabic: "اليوم يوم خاص.",
    },
    {
      english: "spell",
      arabic: "يهجئ",
      sentence: "Can you spell your name?",
      sentenceArabic: "هل يمكنك أن تهجئ اسمك؟",
    },
    {
      english: "spelling",
      arabic: "هجاء",
      sentence: "I practice spelling every day.",
      sentenceArabic: "أمارس الهجاء every day.",
    },
    {
      english: "spend",
      arabic: "يقضي",
      sentence: "I spend time with my family.",
      sentenceArabic: "أقضي الوقت مع عائلتي.",
    },
    {
      english: "sport",
      arabic: "رياضة",
      sentence: "I like to play sports.",
      sentenceArabic: "أحب أن ألعب الرياضة.",
    },
    {
      english: "statement",
      arabic: "بيان",
      sentence: "This is a true statement.",
      sentenceArabic: "هذا بيان صحيح.",
    },
    {
      english: "station",
      arabic: "محطة",
      sentence: "The train station is busy.",
      sentenceArabic: "محطة القطار مزدحمة.",
    },
    {
      english: "stop",
      arabic: "يتوقف",
      sentence: "Stop here, please.",
      sentenceArabic: "توقف هنا من فضلك.",
    },
    {
      english: "story",
      arabic: "قصة",
      sentence: "I read a story every night.",
      sentenceArabic: "أقرأ قصة every night.",
    },
    {
      english: "trousers",
      arabic: "بنطلون",
      sentence: "I wear black trousers.",
      sentenceArabic: "أرتدي بنطلوناً أسود.",
    },
    {
      english: "true",
      arabic: "صحيح",
      sentence: "This is a true story.",
      sentenceArabic: "هذه قصة صحيحة.",
    },
    {
      english: "T-shirt",
      arabic: "تي شيرت",
      sentence: "I wear a T-shirt in summer.",
      sentenceArabic: "أرتدي تي شيرت في الصيف.",
    },
    {
      english: "Tuesday",
      arabic: "الثلاثاء",
      sentence: "We have a meeting on Tuesday.",
      sentenceArabic: "لدينا اجتماع يوم الثلاثاء.",
    },
    {
      english: "turn",
      arabic: "يدور",
      sentence: "Turn right at the corner.",
      sentenceArabic: "انعطف يميناً at الزاوية.",
    },
    {
      english: "TV",
      arabic: "تلفاز",
      sentence: "I watch TV in the evening.",
      sentenceArabic: "أشاهد التلفاز in the المساء.",
    },
    {
      english: "twelve",
      arabic: "اثنا عشر",
      sentence: "There are twelve months in a year.",
      sentenceArabic: "هناك twelve شهراً في السنة.",
    },
    {
      english: "twenty",
      arabic: "عشرون",
      sentence: "My brother is twenty years old.",
      sentenceArabic: "أخي يبلغ من العمر عشرين عاماً.",
    },
    {
      english: "twice",
      arabic: "مرتين",
      sentence: "I exercise twice a week.",
      sentenceArabic: "أتمرن مرتين في الأسبوع.",
    },
    {
      english: "two",
      arabic: "اثنان",
      sentence: "I have two books.",
      sentenceArabic: "لدي كتابان.",
    },
    {
      english: "umbrella",
      arabic: "مظلة",
      sentence: "I use an umbrella when it rains.",
      sentenceArabic: "أستخدم مظلة when تمطر.",
    },
    {
      english: "uncle",
      arabic: "عم",
      sentence: "My uncle visits us every month.",
      sentenceArabic: "عمي يزورنا every month.",
    },
    {
      english: "under",
      arabic: "تحت",
      sentence: "The cat is under the table.",
      sentenceArabic: "القطة under الطاولة.",
    },
    {
      english: "understand",
      arabic: "يفهم",
      sentence: "I understand English.",
      sentenceArabic: "أفهم الإنجليزية.",
    },
    {
      english: "university",
      arabic: "جامعة",
      sentence: "I study at the university.",
      sentenceArabic: "أدرس في الجامعة.",
    },
    {
      english: "until",
      arabic: "حتى",
      sentence: "I work until 5 PM.",
      sentenceArabic: "أعمل حتى الساعة 5 مساءً.",
    },
    {
      english: "begin",
      arabic: "يبدأ",
      sentence: "The movie begins at 8 PM.",
      sentenceArabic: "يبدأ الفيلم at الساعة 8 مساءً.",
    },
    {
      english: "beginning",
      arabic: "بداية",
      sentence: "This is the beginning of the book.",
      sentenceArabic: "هذه بداية الكتاب.",
    },
    {
      english: "behind",
      arabic: "خلف",
      sentence: "The cat is behind the door.",
      sentenceArabic: "القطة behind الباب.",
    },
    {
      english: "believe",
      arabic: "يصدق",
      sentence: "I believe you.",
      sentenceArabic: "أصدقك.",
    },
    {
      english: "below",
      arabic: "أدناه",
      sentence: "Sign your name below.",
      sentenceArabic: "وقع اسمك أدناه.",
    },
    {
      english: "bicycle",
      arabic: "دراجة",
      sentence: "I ride my bicycle to school.",
      sentenceArabic: "أقود دراجتي إلى المدرسة.",
    },
    {
      english: "big",
      arabic: "كبير",
      sentence: "This is a big house.",
      sentenceArabic: "هذا منزل كبير.",
    },
    {
      english: "bike",
      arabic: "دراجة",
      sentence: "I have a new bike.",
      sentenceArabic: "لدي دراجة جديدة.",
    },
    {
      english: "bird",
      arabic: "طائر",
      sentence: "The bird sings beautifully.",
      sentenceArabic: "الطائر يغني beautifully.",
    },
    {
      english: "birthday",
      arabic: "عيد ميلاد",
      sentence: "Happy birthday!",
      sentenceArabic: "عيد ميلاد سعيد!",
    },
    {
      english: "black",
      arabic: "أسود",
      sentence: "I have black hair.",
      sentenceArabic: "لدي شعر أسود.",
    },
    {
      english: "blog",
      arabic: "مدونة",
      sentence: "I write a blog about travel.",
      sentenceArabic: "أكتب مدونة about السفر.",
    },
    {
      english: "blonde",
      arabic: "شقراء",
      sentence: "She has blonde hair.",
      sentenceArabic: "لديها شعر أشقر.",
    },
    {
      english: "blue",
      arabic: "أزرق",
      sentence: "The sky is blue.",
      sentenceArabic: "السماء زرقاء.",
    },
    {
      english: "boat",
      arabic: "قارب",
      sentence: "We ride a boat on the lake.",
      sentenceArabic: "نركب قارباً on البحيرة.",
    },
    {
      english: "body",
      arabic: "جسم",
      sentence: "Exercise is good for your body.",
      sentenceArabic: "التمرين جيد for جسمك.",
    },
    {
      english: "boot",
      arabic: "حذاء",
      sentence: "I wear boots in winter.",
      sentenceArabic: "أرتدي أحذية in الشتاء.",
    },
    {
      english: "bored",
      arabic: "شاعر بالملل",
      sentence: "I am bored.",
      sentenceArabic: "أنا أشعر بالملل.",
    },
    {
      english: "boring",
      arabic: "ممل",
      sentence: "This movie is boring.",
      sentenceArabic: "هذا الفيلم ممل.",
    },
    {
      english: "born",
      arabic: "مولود",
      sentence: "I was born in 1990.",
      sentenceArabic: "لقد ولدت in 1990.",
    },
    {
      english: "both",
      arabic: "كلاهما",
      sentence: "Both of us are students.",
      sentenceArabic: "كلانا طالبان.",
    },
    {
      english: "bottle",
      arabic: "زجاجة",
      sentence: "I drink water from a bottle.",
      sentenceArabic: "أشرب الماء from زجاجة.",
    },
    {
      english: "box",
      arabic: "صندوق",
      sentence: "Put the books in the box.",
      sentenceArabic: "ضع الكتب in الصندوق.",
    },
    {
      english: "boy",
      arabic: "ولد",
      sentence: "The boy is playing.",
      sentenceArabic: "الولد يلعب.",
    },
    {
      english: "boyfriend",
      arabic: "صديق",
      sentence: "My boyfriend is kind.",
      sentenceArabic: "صديقي لطيف.",
    },
    {
      english: "computer",
      arabic: "حاسوب",
      sentence: "I use a computer every day.",
      sentenceArabic: "أستخدم حاسوباً every day.",
    },
    {
      english: "concert",
      arabic: "حفل",
      sentence: "We go to a concert tonight.",
      sentenceArabic: "نذهب إلى حفل tonight.",
    },
    {
      english: "conversation",
      arabic: "محادثة",
      sentence: "We have a conversation in English.",
      sentenceArabic: "نجري محادثة in الإنجليزية.",
    },
    {
      english: "cooking",
      arabic: "طبخ",
      sentence: "I like cooking.",
      sentenceArabic: "أحب الطبخ.",
    },
    {
      english: "correct",
      arabic: "صحيح",
      sentence: "Your answer is correct.",
      sentenceArabic: "إجابتك صحيحة.",
    },
    {
      english: "cost",
      arabic: "يكلف",
      sentence: "How much does it cost?",
      sentenceArabic: "كم يكلف؟",
    },
    {
      english: "could",
      arabic: "يمكن",
      sentence: "Could you help me?",
      sentenceArabic: "هل يمكنك مساعدتي؟",
    },
    {
      english: "during",
      arabic: "أثناء",
      sentence: "I read during my free time.",
      sentenceArabic: "أقرأ during وقت فراغي.",
    },
    {
      english: "DVD",
      arabic: "دي في دي",
      sentence: "I watch movies on DVD.",
      sentenceArabic: "أشاهد الأفلام on DVD.",
    },
    {
      english: "each",
      arabic: "كل",
      sentence: "Each student has a book.",
      sentenceArabic: "كل طالب لديه كتاب.",
    },
    {
      english: "ear",
      arabic: "أذن",
      sentence: "I hear with my ears.",
      sentenceArabic: "أسمع with أذني.",
    },
    {
      english: "early",
      arabic: "مبكر",
      sentence: "I wake up early.",
      sentenceArabic: "أستيقظ مبكراً.",
    },
    {
      english: "east",
      arabic: "شرق",
      sentence: "The sun rises in the east.",
      sentenceArabic: "الشمس تشرق in الشرق.",
    },
    {
      english: "easy",
      arabic: "سهل",
      sentence: "This exercise is easy.",
      sentenceArabic: "هذا التمرين سهل.",
    },
    {
      english: "eat",
      arabic: "يأكل",
      sentence: "I eat breakfast at 8 AM.",
      sentenceArabic: "آكل الفطور at الساعة 8 صباحاً.",
    },
    {
      english: "egg",
      arabic: "بيضة",
      sentence: "I eat eggs for breakfast.",
      sentenceArabic: "آكل البيض on الإفطار.",
    },
    {
      english: "eight",
      arabic: "ثمانية",
      sentence: "I have eight books.",
      sentenceArabic: "لدي ثمانية كتب.",
    },
    {
      english: "eighteen",
      arabic: "ثمانية عشر",
      sentence: "My sister is eighteen years old.",
      sentenceArabic: "أختي تبلغ من العمر ثمانية عشر عاماً.",
    },
    {
      english: "eighty",
      arabic: "ثمانون",
      sentence: "My grandfather is eighty years old.",
      sentenceArabic: "جدي يبلغ من العمر ثمانين عاماً.",
    },
    {
      english: "elephant",
      arabic: "فيل",
      sentence: "The elephant is a big animal.",
      sentenceArabic: "الفيل حيوان كبير.",
    },
    {
      english: "eleven",
      arabic: "أحد عشر",
      sentence: "I have eleven books.",
      sentenceArabic: "لدي أحد عشر كتاباً.",
    },
    {
      english: "else",
      arabic: "آخر",
      sentence: "What else do you need?",
      sentenceArabic: "ماذا else تحتاج؟",
    },
    {
      english: "email",
      arabic: "بريد إلكتروني",
      sentence: "I check my email every day.",
      sentenceArabic: "أتفحص بريدي الإلكتروني every day.",
    },
    {
      english: "end",
      arabic: "نهاية",
      sentence: "This is the end of the book.",
      sentenceArabic: "هذه نهاية الكتاب.",
    },
    {
      english: "forty",
      arabic: "أربعون",
      sentence: "My father is forty years old.",
      sentenceArabic: "والدي يبلغ من العمر أربعين عاماً.",
    },
    {
      english: "four",
      arabic: "أربعة",
      sentence: "I have four books.",
      sentenceArabic: "لدي أربعة كتب.",
    },
    {
      english: "fourteen",
      arabic: "أربعة عشر",
      sentence: "My brother is fourteen years old.",
      sentenceArabic: "أخي يبلغ من العمر أربعة عشر عاماً.",
    },
    {
      english: "fourth",
      arabic: "رابع",
      sentence: "This is my fourth visit.",
      sentenceArabic: "هذه زيارتي الرابعة.",
    },
    {
      english: "Friday",
      arabic: "الجمعة",
      sentence: "We pray on Friday.",
      sentenceArabic: "نصلي day الجمعة.",
    },
    {
      english: "friend",
      arabic: "صديق",
      sentence: "He is my best friend.",
      sentenceArabic: "هو صديقي المفضل.",
    },
    {
      english: "friendly",
      arabic: "ودود",
      sentence: "She is very friendly.",
      sentenceArabic: "هي very ودودة.",
    },
    {
      english: "from",
      arabic: "من",
      sentence: "I am from Egypt.",
      sentenceArabic: "أنا from مصر.",
    },
    {
      english: "front",
      arabic: "أمام",
      sentence: "The bank is in front of the post office.",
      sentenceArabic: "البنك in front of مكتب البريد.",
    },
    {
      english: "fruit",
      arabic: "فاكهة",
      sentence: "I eat fruit every day.",
      sentenceArabic: "آكل الفاكهة every day.",
    },
    {
      english: "full",
      arabic: "ممتلئ",
      sentence: "The glass is full of water.",
      sentenceArabic: "الكوب full of الماء.",
    },
    {
      english: "funny",
      arabic: "مضحك",
      sentence: "This is a funny story.",
      sentenceArabic: "هذه قصة مضحكة.",
    },
    {
      english: "game",
      arabic: "لعبة",
      sentence: "We play games every weekend.",
      sentenceArabic: "نلعب الألعاب every weekend.",
    },
    {
      english: "garden",
      arabic: "حديقة",
      sentence: "We have a small garden.",
      sentenceArabic: "لدينا حديقة صغيرة.",
    },
    {
      english: "geography",
      arabic: "جغرافيا",
      sentence: "I study geography at school.",
      sentenceArabic: "أدرس الجغرافيا in المدرسة.",
    },
    {
      english: "get",
      arabic: "يحصل",
      sentence: "I get up at 7 AM.",
      sentenceArabic: "أستيقظ at الساعة 7 صباحاً.",
    },
    {
      english: "girl",
      arabic: "فتاة",
      sentence: "The girl is reading a book.",
      sentenceArabic: "الفتاة تقرأ كتاباً.",
    },
    {
      english: "girlfriend",
      arabic: "صديقة",
      sentence: "My girlfriend is kind.",
      sentenceArabic: "صديقتي لطيفة.",
    },
    {
      english: "interest",
      arabic: "اهتمام",
      sentence: "I have an interest in music.",
      sentenceArabic: "لدي اهتمام in الموسيقى.",
    },
    {
      english: "interested",
      arabic: "مهتم",
      sentence: "I am interested in art.",
      sentenceArabic: "أنا مهتم in الفن.",
    },
    {
      english: "interesting",
      arabic: "مثير للاهتمام",
      sentence: "This book is interesting.",
      sentenceArabic: "هذا الكتاب مثير للاهتمام.",
    },
    {
      english: "internet",
      arabic: "إنترنت",
      sentence: "I use the internet every day.",
      sentenceArabic: "أستخدم الإنترنت every day.",
    },
    {
      english: "interview",
      arabic: "مقابلة",
      sentence: "I have a job interview tomorrow.",
      sentenceArabic: "لدي مقابلة عمل tomorrow.",
    },
    {
      english: "into",
      arabic: "إلى",
      sentence: "Come into the room.",
      sentenceArabic: "تعال into الغرفة.",
    },
    {
      english: "introduce",
      arabic: "يعرف",
      sentence: "Let me introduce myself.",
      sentenceArabic: "دعني أعرف نفسي.",
    },
    {
      english: "island",
      arabic: "جزيرة",
      sentence: "We visit an island every summer.",
      sentenceArabic: "نزور جزيرة every صيف.",
    },
    {
      english: "it",
      arabic: "هو",
      sentence: "It is a book.",
      sentenceArabic: "هو كتاب.",
    },
    {
      english: "its",
      arabic: "له",
      sentence: "The dog wags its tail.",
      sentenceArabic: "الكلب يهز ذيله.",
    },
    {
      english: "jacket",
      arabic: "سترة",
      sentence: "I wear a jacket in winter.",
      sentenceArabic: "أرتدي سترة in الشتاء.",
    },
    {
      english: "January",
      arabic: "يناير",
      sentence: "January is the first month.",
      sentenceArabic: "يناير هو first شهر.",
    },
    {
      english: "jeans",
      arabic: "جينز",
      sentence: "I wear jeans every day.",
      sentenceArabic: "أرتدي الجينز every day.",
    },
    {
      english: "job",
      arabic: "وظيفة",
      sentence: "I have a new job.",
      sentenceArabic: "لدي وظيفة جديدة.",
    },
    {
      english: "join",
      arabic: "ينضم",
      sentence: "I want to join the club.",
      sentenceArabic: "أريد أن join النادي.",
    },
    {
      english: "journey",
      arabic: "رحلة",
      sentence: "We have a long journey.",
      sentenceArabic: "لدينا رحلة طويلة.",
    },
    {
      english: "juice",
      arabic: "عصير",
      sentence: "I drink orange juice.",
      sentenceArabic: "أشرب عصير البرتقال.",
    },
    {
      english: "July",
      arabic: "يوليو",
      sentence: "July is a hot month.",
      sentenceArabic: "يوليو شهر حار.",
    },
    {
      english: "million",
      arabic: "مليون",
      sentence: "This city has a million people.",
      sentenceArabic: "هذه المدينة بها million نسمة.",
    },
    {
      english: "minute",
      arabic: "دقيقة",
      sentence: "Wait a minute, please.",
      sentenceArabic: "انتظر دقيقة من فضلك.",
    },
    {
      english: "miss",
      arabic: "يشتاق",
      sentence: "I miss my family.",
      sentenceArabic: "أشتاق إلى عائلتي.",
    },
    {
      english: "modern",
      arabic: "حديث",
      sentence: "This is a modern building.",
      sentenceArabic: "هذا مبنى حديث.",
    },
    {
      english: "moment",
      arabic: "لحظة",
      sentence: "Wait a moment, please.",
      sentenceArabic: "انتظر لحظة من فضلك.",
    },
    {
      english: "Monday",
      arabic: "الاثنين",
      sentence: "We start work on Monday.",
      sentenceArabic: "نبدأ العمل day الاثنين.",
    },
    {
      english: "money",
      arabic: "مال",
      sentence: "I need money to buy books.",
      sentenceArabic: "أحتاج المال to شراء الكتب.",
    },
    {
      english: "month",
      arabic: "شهر",
      sentence: "There are twelve months in a year.",
      sentenceArabic: "هناك twelve شهراً في السنة.",
    },
    {
      english: "more",
      arabic: "أكثر",
      sentence: "I need more time.",
      sentenceArabic: "أحتاج more الوقت.",
    },
    {
      english: "morning",
      arabic: "صباح",
      sentence: "I exercise in the morning.",
      sentenceArabic: "أتمرن in the الصباح.",
    },
    {
      english: "most",
      arabic: "معظم",
      sentence: "Most people like music.",
      sentenceArabic: "معظم الناس يحبون الموسيقى.",
    },
    {
      english: "mother",
      arabic: "أم",
      sentence: "My mother is a teacher.",
      sentenceArabic: "أمي مدرسة.",
    },
    {
      english: "mountain",
      arabic: "جبل",
      sentence: "We climb mountains in summer.",
      sentenceArabic: "نتسلق الجبال in الصيف.",
    },
    {
      english: "mouse",
      arabic: "فأر",
      sentence: "The mouse is small.",
      sentenceArabic: "الفأر صغير.",
    },
    {
      english: "mouth",
      arabic: "فم",
      sentence: "I eat with my mouth.",
      sentenceArabic: "آكل with فمي.",
    },
    {
      english: "movie",
      arabic: "فيلم",
      sentence: "We watch a movie every weekend.",
      sentenceArabic: "نشاهد فيلماً every weekend.",
    },
    {
      english: "much",
      arabic: "كثير",
      sentence: "How much does it cost?",
      sentenceArabic: "كم يكلف؟",
    },
    {
      english: "mum",
      arabic: "أم",
      sentence: "My mum cooks delicious food.",
      sentenceArabic: "أمي تطهو طعاماً لذيذاً.",
    },
    {
      english: "museum",
      arabic: "متحف",
      sentence: "We visit the museum every month.",
      sentenceArabic: "نزور المتحف every شهر.",
    },
    {
      english: "music",
      arabic: "موسيقى",
      sentence: "I listen to music every day.",
      sentenceArabic: "أستمع إلى الموسيقى every day.",
    },
    {
      english: "must",
      arabic: "يجب",
      sentence: "I must study for the exam.",
      sentenceArabic: "يجب أن أدرس for الامتحان.",
    },
    {
      english: "my",
      arabic: "لي",
      sentence: "This is my book.",
      sentenceArabic: "هذا كتابي.",
    },
    {
      english: "name",
      arabic: "اسم",
      sentence: "What is your name?",
      sentenceArabic: "ما هو اسمك؟",
    },
    {
      english: "natural",
      arabic: "طبيعي",
      sentence: "This is natural honey.",
      sentenceArabic: "هذا عسل طبيعي.",
    },
    {
      english: "photo",
      arabic: "صورة",
      sentence: "I take photos with my camera.",
      sentenceArabic: "ألتقط الصور with كاميرتي.",
    },
    {
      english: "phrase",
      arabic: "عبارة",
      sentence: "I learn new phrases every day.",
      sentenceArabic: "أتعلم عبارات جديدة every day.",
    },
    {
      english: "piano",
      arabic: "بيانو",
      sentence: "I play the piano.",
      sentenceArabic: "أعزف على البيانو.",
    },
    {
      english: "piece",
      arabic: "قطعة",
      sentence: "I eat a piece of cake.",
      sentenceArabic: "آكل قطعة of كعكة.",
    },
    {
      english: "pig",
      arabic: "خنزير",
      sentence: "The pig is a farm animal.",
      sentenceArabic: "الخنزير حيوان مزرعة.",
    },
    {
      english: "pink",
      arabic: "وردي",
      sentence: "She wears a pink dress.",
      sentenceArabic: "هي ترتدي فستاناً وردياً.",
    },
    {
      english: "plan",
      arabic: "يخطط",
      sentence: "I plan my day every morning.",
      sentenceArabic: "أخطط ليومي every morning.",
    },
    {
      english: "plane",
      arabic: "طائرة",
      sentence: "We travel by plane.",
      sentenceArabic: "نسافر by طائرة.",
    },
    {
      english: "play",
      arabic: "يلعب",
      sentence: "Children play in the park.",
      sentenceArabic: "الأطفال يلعبون in الحديقة.",
    },
    {
      english: "player",
      arabic: "لاعب",
      sentence: "He is a football player.",
      sentenceArabic: "هو لاعب كرة قدم.",
    },
    {
      english: "police",
      arabic: "شرطة",
      sentence: "The police help people.",
      sentenceArabic: "الشرطة تساعد الناس.",
    },
    {
      english: "policeman",
      arabic: "شرطي",
      sentence: "The policeman directs traffic.",
      sentenceArabic: "الشرطي يوجه المرور.",
    },
    {
      english: "pool",
      arabic: "مسبح",
      sentence: "We swim in the pool.",
      sentenceArabic: "نسبح in المسبح.",
    },
    {
      english: "poor",
      arabic: "فقير",
      sentence: "He is poor.",
      sentenceArabic: "هو فقير.",
    },
    {
      english: "popular",
      arabic: "شعبي",
      sentence: "This is a popular song.",
      sentenceArabic: "هذه أغنية شعبية.",
    },
    {
      english: "possible",
      arabic: "ممكن",
      sentence: "Is it possible to learn English in three months?",
      sentenceArabic: "هل من possible أن تتعلم الإنجليزية in ثلاثة أشهر؟",
    },
    {
      english: "post",
      arabic: "بريد",
      sentence: "I send letters by post.",
      sentenceArabic: "أرسل الرسائل by بريد.",
    },
    {
      english: "restaurant",
      arabic: "مطعم",
      sentence: "We eat at a restaurant every weekend.",
      sentenceArabic: "نأكل في مطعم every weekend.",
    },
    {
      english: "return",
      arabic: "يعود",
      sentence: "I return home at 6 PM.",
      sentenceArabic: "أعود إلى البيت at الساعة 6 مساءً.",
    },
    {
      english: "rice",
      arabic: "أرز",
      sentence: "I eat rice with chicken.",
      sentenceArabic: "آكل الأرز with الدجاج.",
    },
    {
      english: "rich",
      arabic: "غني",
      sentence: "He is rich.",
      sentenceArabic: "هو غني.",
    },
    {
      english: "right",
      arabic: "يمين",
      sentence: "Turn right at the corner.",
      sentenceArabic: "انعطف يميناً at الزاوية.",
    },
    {
      english: "river",
      arabic: "نهر",
      sentence: "We swim in the river.",
      sentenceArabic: "نسبح in النهر.",
    },
    {
      english: "road",
      arabic: "طريق",
      sentence: "This road leads to the city.",
      sentenceArabic: "هذا الطريق leads to المدينة.",
    },
    {
      english: "room",
      arabic: "غرفة",
      sentence: "I clean my room every day.",
      sentenceArabic: "أنظف غرفتي every day.",
    },
  ],
  B1: [
    {
      english: "attitude",
      arabic: "موقف / سلوك",
      sentence: "She has a very positive attitude towards her work.",
      sentenceArabic: "لديها موقف إيجابي جدًا تجاه عملها.",
    },
    {
      english: "attract",
      arabic: "يجذب",
      sentence: "The bright colors of the flower attract bees.",
      sentenceArabic: "الألوان الزاهية للزهرة تجذب النحل.",
    },
    {
      english: "attraction",
      arabic: "جذب / معلم جذب",
      sentence: "The Eiffel Tower is a major tourist attraction in Paris.",
      sentenceArabic: "برج إيفل هو معلم جذب سياحي رئيسي في باريس.",
    },
    {
      english: "authority",
      arabic: "سلطة",
      sentence: "The police have the authority to stop cars.",
      sentenceArabic: "الشرطة لديها السلطة لإيقاف السيارات.",
    },
    {
      english: "average",
      arabic: "متوسط",
      sentence: "The average temperature in summer is 30 degrees.",
      sentenceArabic: "متوسط درجة الحرارة في الصيف هو 30 درجة.",
    },
    {
      english: "award",
      arabic: "جائزة",
      sentence: "She won an award for her excellent poem.",
      sentenceArabic: "لقد فازت بجائزة عن قصيدتها الممتازة.",
    },
    {
      english: "aware",
      arabic: "واعٍ / مدرك",
      sentence: "Are you aware of the new school rules?",
      sentenceArabic: "هل أنت على علم بقواعد المدرسة الجديدة؟",
    },
    {
      english: "backwards",
      arabic: "إلى الوراء",
      sentence: "Please be careful when you walk backwards.",
      sentenceArabic: "يرجى توخي الحذر عندما تمشي إلى الوراء.",
    },
    {
      english: "bake",
      arabic: "يخبز",
      sentence: "My father likes to bake bread on weekends.",
      sentenceArabic: "والدي يحب خبز الخبز في عطلات نهاية الأسبوع.",
    },
    {
      english: "balance",
      arabic: "توازن",
      sentence: "It's important to keep a balance between work and fun.",
      sentenceArabic: "من المهم الحفاظ على توازن بين العمل والمرح.",
    },
    {
      english: "ban",
      arabic: "يحظر",
      sentence: "The government decided to ban smoking in restaurants.",
      sentenceArabic: "قررت الحكومة حظر التدخين في المطاعم.",
    },
    {
      english: "bank",
      arabic: "بنك",
      sentence: "I need to go to the bank to withdraw some money.",
      sentenceArabic: "أحتاج إلى الذهاب إلى البنك لسحب بعض المال.",
    },
    {
      english: "base",
      arabic: "قاعدة",
      sentence: "The company's base is in London.",
      sentenceArabic: "قاعدة الشركة هي في لندن.",
    },
    {
      english: "basic",
      arabic: "أساسي",
      sentence: "Learning the basic rules is the first step.",
      sentenceArabic: "تعلم القواعد الأساسية هي الخطوة الأولى.",
    },
    {
      english: "basis",
      arabic: "أساس",
      sentence: "We meet on a weekly basis to discuss the project.",
      sentenceArabic: "نلتقي على أساس أسبوعي لمناقشة المشروع.",
    },
    {
      english: "battery",
      arabic: "بطارية",
      sentence: "The remote control needs new batteries.",
      sentenceArabic: "جهاز التحكم عن بعد يحتاج إلى بطاريات جديدة.",
    },
    {
      english: "beauty",
      arabic: "جمال",
      sentence: "The beauty of the mountains took my breath away.",
      sentenceArabic: "جمال الجبال أذهلني.",
    },
    {
      english: "bee",
      arabic: "نحلة",
      sentence: "A bee is flying around the garden.",
      sentenceArabic: "نحلة تحلق حول الحديقة.",
    },
    {
      english: "though",
      arabic: "على الرغم من",
      sentence: "Though it was raining, we went for a walk.",
      sentenceArabic: "على الرغم من أنها كانت تمطر، ذهبنا لنتمشى.",
    },
    {
      english: "throat",
      arabic: "حلق",
      sentence: "I have a sore throat and I can't speak loudly.",
      sentenceArabic: "لدي التهاب في الحلق ولا أستطيع التحدث بصوت عالٍ.",
    },
    {
      english: "throughout",
      arabic: "خلال / في جميع أنحاء",
      sentence: "It rained throughout the night.",
      sentenceArabic: "لقد أمطرت خلال الليل.",
    },
    {
      english: "tight",
      arabic: "ضيق",
      sentence: "These shoes are too tight for me.",
      sentenceArabic: "هذه الأحذية ضيقة جدًا عليّ.",
    },
    {
      english: "till",
      arabic: "حتى",
      sentence: "I will wait here till you come back.",
      sentenceArabic: "سأنتظر هنا حتى تعود.",
    },
    {
      english: "tin",
      arabic: "علبة",
      sentence: "We need a tin of beans for the recipe.",
      sentenceArabic: "نحن بحاجة إلى علبة فاصولياء للوصفة.",
    },
    {
      english: "tiny",
      arabic: "ضئيل / صغير جدًا",
      sentence: "A tiny insect landed on my hand.",
      sentenceArabic: "حشرة صغيرة جدًا هبطت على يدي.",
    },
    {
      english: "tip",
      arabic: "نصيحة / بقشيش",
      sentence: "Here's a useful tip: always double-check your work.",
      sentenceArabic: "ها هي نصيحة مفيدة: دائمًا راجع عملك مرتين.",
    },
    {
      english: "toe",
      arabic: "إصبع القدم",
      sentence: "I hurt my big toe when I kicked the table.",
      sentenceArabic: "لقد آذيت إصبع قدمي الكبير عندما ركلت الطاولة.",
    },
    {
      english: "tongue",
      arabic: "لسان",
      sentence: "The doctor asked me to stick out my tongue.",
      sentenceArabic: "طلب مني الطبيب إخراج لساني.",
    },
    {
      english: "total",
      arabic: "مجموع / كلي",
      sentence: "The total cost of my shopping was fifty pounds.",
      sentenceArabic: "كان التكلفة الإجمالية لتسوقي خمسين جنيهاً.",
    },
    {
      english: "totally",
      arabic: "تمامًا",
      sentence: "I totally agree with your opinion.",
      sentenceArabic: "أنا أتفق تمامًا مع رأيك.",
    },
    {
      english: "touch",
      arabic: "لمس",
      sentence: "Please do not touch the paintings in the museum.",
      sentenceArabic: "يرجى عدم لمس اللوحات في المتحف.",
    },
    {
      english: "tour",
      arabic: "جولة",
      sentence: "We went on a tour of the old castle.",
      sentenceArabic: "ذهبنا في جولة داخل القلعة القديمة.",
    },
    {
      english: "trade",
      arabic: "تجارة",
      sentence: "International trade is important for the economy.",
      sentenceArabic: "التجارة الدولية مهمة للاقتصاد.",
    },
    {
      english: "translate",
      arabic: "يترجم",
      sentence: "Can you translate this sentence into Arabic?",
      sentenceArabic: "هل يمكنك ترجمة هذه الجملة إلى العربية؟",
    },
    {
      english: "translation",
      arabic: "ترجمة",
      sentence: "The translation of the book was very accurate.",
      sentenceArabic: "كانت ترجمة الكتاب دقيقة جدًا.",
    },
    {
      english: "transport",
      arabic: "نقل",
      sentence: "Public transport in this city is excellent.",
      sentenceArabic: "النقل العام في هذه المدينة ممتاز.",
    },
    {
      english: "treat",
      arabic: "يعامل / يحاول علاج",
      sentence: "My uncle will treat us to dinner tonight.",
      sentenceArabic: "عمي سيدعونا لتناول العشاء الليلة.",
    },
    {
      english: "treatment",
      arabic: "معاملة / علاج",
      sentence: "She is receiving treatment for her illness.",
      sentenceArabic: "إنها تتلقى علاجًا لمرضها.",
    },
    {
      english: "trend",
      arabic: "اتجاه / موضة",
      sentence: "Wearing bright colors is the latest trend.",
      sentenceArabic: "ارتداء الألوان الزاهية هو أحدث اتجاه.",
    },
    {
      english: "wing",
      arabic: "جناح",
      sentence: "The bird broke its wing and couldn't fly.",
      sentenceArabic: "كسر الطائر جناحه ولم يستطع الطيران.",
    },
    {
      english: "within",
      arabic: "داخل / في غضون",
      sentence: "Please reply within two days.",
      sentenceArabic: "يرجى الرد في غضون يومين.",
    },
    {
      english: "wonder",
      arabic: "يتساءل / عجب",
      sentence: "I wonder what time the film starts.",
      sentenceArabic: "أتساءل في أي وقت يبدأ الفيلم.",
    },
    {
      english: "wool",
      arabic: "صوف",
      sentence: "This sweater is made of soft wool.",
      sentenceArabic: "هذه sweater مصنوعة من صوف ناعم.",
    },
    {
      english: "worldwide",
      arabic: "عالمي",
      sentence: "This famous brand is sold worldwide.",
      sentenceArabic: "هذه الماركة الشهيرة تباع worldwide.",
    },
    {
      english: "worry",
      arabic: "يقلق",
      sentence: "Don't worry, everything will be fine.",
      sentenceArabic: "لا تقلق، كل شيء سيكون على ما يرام.",
    },
    {
      english: "written",
      arabic: "مكتوب",
      sentence: "The instructions are written on the box.",
      sentenceArabic: "التعليمات مكتوبة على الصندوق.",
    },
    {
      english: "yard",
      arabic: "ساحة",
      sentence: "The children are playing in the yard.",
      sentenceArabic: "الأطفال يلعبون في الساحة.",
    },
    {
      english: "young",
      arabic: "شاب / صغير",
      sentence: "She is too young to watch that film.",
      sentenceArabic: "إنها صغيرة جدًا على مشاهدة ذلك الفيلم.",
    },
    {
      english: "youth",
      arabic: "شباب",
      sentence: "He spent his youth in a small village.",
      sentenceArabic: "قضى شبابه في قرية صغيرة.",
    },
    {
      english: "clause",
      arabic: "بند / جملة فرعية",
      sentence: "This sentence has a main clause and a subordinate clause.",
      sentenceArabic: "هذه الجملة تحتوي على جملة رئيسية وجملة فرعية.",
    },
    {
      english: "clear",
      arabic: "واضح",
      sentence: "The teacher gave clear instructions.",
      sentenceArabic: "المعلم أعطى تعليمات واضحة.",
    },
    {
      english: "click",
      arabic: "نقرة / ينقر",
      sentence: "Click on the icon to open the program.",
      sentenceArabic: "انقر على الأيقونة لفتح البرنامج.",
    },
    {
      english: "client",
      arabic: "عميل",
      sentence: "She has an important meeting with a new client.",
      sentenceArabic: "لديها اجتماع مهم مع عميل جديد.",
    },
    {
      english: "climb",
      arabic: "يتسلق",
      sentence: "It's dangerous to climb that high mountain.",
      sentenceArabic: "من الخطورة تسلق ذلك الجبل العالي.",
    },
    {
      english: "close2",
      arabic: "قريب (صفة)",
      sentence: "My best friend lives very close to me.",
      sentenceArabic: "أفضل صديق لي يعيش قريبًا جدًا مني.",
    },
    {
      english: "cloth",
      arabic: "قماش",
      sentence: "She wiped the table with a soft cloth.",
      sentenceArabic: "مسحت الطاولة بقطعة قماش ناعمة.",
    },
    {
      english: "clue",
      arabic: "دليل / فكرة",
      sentence: "The police are looking for clues to solve the crime.",
      sentenceArabic: "الشرطة تبحث عن أدلة لحل الجريمة.",
    },
    {
      english: "coach",
      arabic: "مدرب / حافلة",
      sentence: "The football coach gave the team a pep talk.",
      sentenceArabic: "مدرب كرة القدم ألقى كلمة تحفيزية للفريق.",
    },
    {
      english: "coal",
      arabic: "فحم",
      sentence: "In the past, many trains were powered by coal.",
      sentenceArabic: "في الماضي، كانت العديد من القطارات تعمل بالفحم.",
    },
    {
      english: "coin",
      arabic: "عملة معدنية",
      sentence: "I found an old coin on the street.",
      sentenceArabic: "وجدت عملة معدنية قديمة في الشارع.",
    },
    {
      english: "collection",
      arabic: "مجموعة",
      sentence: "He has a large collection of stamps.",
      sentenceArabic: "لديه مجموعة كبيرة من الطوابع.",
    },
    {
      english: "coloured",
      arabic: "ملون",
      sentence: "The children were drawing with coloured pencils.",
      sentenceArabic: "كان الأطفال يرسمون بأقلام ملونة.",
    },
    {
      english: "combine",
      arabic: "يجمع",
      sentence: "We can combine blue and yellow to make green.",
      sentenceArabic: "يمكننا جمع الأزرق والأصفر لصنع اللون الأخضر.",
    },
    {
      english: "comment",
      arabic: "تعليق",
      sentence: "Would you like to add a comment about the service?",
      sentenceArabic: "هل ترغب في إضافة تعليق حول الخدمة؟",
    },
    {
      english: "commercial",
      arabic: "تجاري",
      sentence: "The commercial success of the product was huge.",
      sentenceArabic: "كان النجاح التجاري للمنتج هائلاً.",
    },
    {
      english: "commit",
      arabic: "يرتكب / يلتزم",
      sentence: "He committed himself to learning the piano.",
      sentenceArabic: "التزم بتعلم العزف على البيانو.",
    },
    {
      english: "communication",
      arabic: "اتصال / تواصل",
      sentence: "Good communication is key to a successful team.",
      sentenceArabic: "التواصل الجيد هو مفتاح فريق ناجح.",
    },
    {
      english: "comparison",
      arabic: "مقارنة",
      sentence:
        "A comparison between the two products shows clear differences.",
      sentenceArabic: "تُظهر مقارنة بين المنتجين اختلافات واضحة.",
    },
    {
      english: "competitive",
      arabic: "تنافسي",
      sentence: "She has a very competitive spirit.",
      sentenceArabic: "لديها روح تنافسية عالية.",
    },
    {
      english: "competitor",
      arabic: "منافس",
      sentence: "Our main competitor has lowered their prices.",
      sentenceArabic: "خفض منافسنا الرئيسي أسعاره.",
    },
    {
      english: "complaint",
      arabic: "شكوى",
      sentence: "If you have a complaint, please speak to the manager.",
      sentenceArabic: "إذا كان لديك شكوى، يرجى التحدث إلى المدير.",
    },
    {
      english: "difficulty",
      arabic: "صعوبة",
      sentence: "I had great difficulty understanding the accent.",
      sentenceArabic: "واجهت صعوبة كبيرة في فهم اللهجة.",
    },
    {
      english: "direct",
      arabic: "مباشر",
      sentence: "This is a direct flight to Cairo.",
      sentenceArabic: "هذه رحلة مباشرة إلى القاهرة.",
    },
    {
      english: "directly",
      arabic: "مباشرة",
      sentence: "He looked directly at me when he spoke.",
      sentenceArabic: "نظر إلي مباشرة عندما تحدث.",
    },
    {
      english: "dirt",
      arabic: "أتربة / وسخ",
      sentence: "Please wipe your shoes, they are full of dirt.",
      sentenceArabic: "يرجى مسح حذائك، فهو مليء بالأتربة.",
    },
    {
      english: "disadvantage",
      arabic: "عيب / سلبيات",
      sentence: "One disadvantage of living here is the noise.",
      sentenceArabic: "أحد سلبيات العيش هنا هو الضوضاء.",
    },
    {
      english: "disappointed",
      arabic: "خائب الأمل",
      sentence: "I was disappointed with the exam results.",
      sentenceArabic: "كنت خائب الأمل من نتائج الامتحان.",
    },
    {
      english: "disappointing",
      arabic: "مخيب للآمال",
      sentence: "The weather was disappointing on our holiday.",
      sentenceArabic: "كان الطقس مخيبًا للآمال في عطلتنا.",
    },
    {
      english: "dislike",
      arabic: "يكره",
      sentence: "I dislike getting up early in the morning.",
      sentenceArabic: "أكره الاستيقاظ مبكرًا في الصباح.",
    },
    {
      english: "documentary",
      arabic: "وثائقي",
      sentence: "We watched a fascinating documentary about whales.",
      sentenceArabic: "شاهدنا فيلماً وثائقياً رائعًا عن الحيتان.",
    },
    {
      english: "donate",
      arabic: "يتبرع",
      sentence: "Many people donate money to charity.",
      sentenceArabic: "العديد من الناس يتبرعون بالمال للجمعيات الخيرية.",
    },
    {
      english: "adv.",
      arabic: "اختصار لـ Adverb (ظرف)",
      sentence: "The word 'quickly' is an adv.",
      sentenceArabic: 'كلمة "بسرعة" هي ظرف (adverb).',
    },
    {
      english: "doubt",
      arabic: "شك",
      sentence: "I have no doubt that you will succeed.",
      sentenceArabic: "ليس لدي شك في أنك ستفلح.",
    },
    {
      english: "dressed",
      arabic: "يرتدي ملابس / متأنق",
      sentence: "She was dressed in a beautiful red dress.",
      sentenceArabic: "كانت ترتدي فستانًا أحمر جميلاً.",
    },
    {
      english: "drop",
      arabic: "يسقط / يوقع",
      sentence: "Be careful not to drop the glass.",
      sentenceArabic: "كن حذرًا ولا تسقط الزجاج.",
    },
    {
      english: "fence",
      arabic: "سياج",
      sentence: "The dog ran around the garden behind the fence.",
      sentenceArabic: "ركض الكلب حول الحديقة خلف السياج.",
    },
    {
      english: "fighting",
      arabic: "قتال",
      sentence: "The fighting between the two countries finally stopped.",
      sentenceArabic: "توقف القتال بين البلدين أخيرًا.",
    },
    {
      english: "financial",
      arabic: "مالي",
      sentence: "They are having some financial problems.",
      sentenceArabic: "هم يعانون من بعض المشاكل المالية.",
    },
    {
      english: "fire",
      arabic: "نار / حريق",
      sentence: "The fire spread quickly through the old building.",
      sentenceArabic: "انتشر الحريق بسرعة في المبنى القديم.",
    },
    {
      english: "fitness",
      arabic: "لياقة بدنية",
      sentence: "Regular exercise improves your fitness.",
      sentenceArabic: "التمرين المنتظم يحسن لياقتك البدنية.",
    },
    {
      english: "fixed",
      arabic: "ثابت / مُصلَح",
      sentence: "The price is fixed, you cannot negotiate.",
      sentenceArabic: "السعر ثابت، لا يمكنك المساومة.",
    },
    {
      english: "flag",
      arabic: "علم",
      sentence: "The national flag was flying on top of the building.",
      sentenceArabic: "كان العلم الوطني يرفرف على قمة المبنى.",
    },
    {
      english: "flood",
      arabic: "فيضان",
      sentence: "The heavy rain caused a flood in the village.",
      sentenceArabic: "تسبب المطر الغزير في فيضان في القرية.",
    },
    {
      english: "flour",
      arabic: "دقيق",
      sentence: "We need flour, sugar, and eggs to make a cake.",
      sentenceArabic: "نحتاج إلى دقيق وسكر وبيض لصنع كعكة.",
    },
    {
      english: "flow",
      arabic: "يتدفق",
      sentence: "The river flows into the sea.",
      sentenceArabic: "النهر يتدفق إلى البحر.",
    },
    {
      english: "folk",
      arabic: "شعبي / تقليدي",
      sentence: "We listened to some traditional folk music.",
      sentenceArabic: "استمعنا إلى بعض الموسيقى الشعبية التقليدية.",
    },
    {
      english: "force",
      arabic: "قوة / يجبر",
      sentence: "The force of the wind knocked down the trees.",
      sentenceArabic: "قوة الريح knocked down الأشجار.",
    },
    {
      english: "forever",
      arabic: "إلى الأبد",
      sentence: "I will remember this day forever.",
      sentenceArabic: "سأتذكر هذا اليوم إلى الأبد.",
    },
    {
      english: "hurry",
      arabic: "عجلة / يستعجل",
      sentence: "We are in a hurry to catch the train.",
      sentenceArabic: "نحن في عجلة من أمرنا لنتلقف القطار.",
    },
    {
      english: "identity",
      arabic: "هوية",
      sentence: "You need to show your identity card at the airport.",
      sentenceArabic: "تحتاج إلى إظهار بطاقة هويتك في المطار.",
    },
    {
      english: "ignore",
      arabic: "يتجاهل",
      sentence: "It's rude to ignore people when they speak to you.",
      sentenceArabic: "من الوقاحة تجاهل الناس عندما يتحدثون إليك.",
    },
    {
      english: "illegal",
      arabic: "غير قانوني",
      sentence: "It is illegal to park your car here.",
      sentenceArabic: "من غير القانوني ركن سيارتك هنا.",
    },
    {
      english: "imaginary",
      arabic: "خيالي",
      sentence: "My little sister has an imaginary friend.",
      sentenceArabic: "أختي الصغيرة لديها صديق خيالي.",
    },
    {
      english: "immediate",
      arabic: "فوري",
      sentence: "The government must take immediate action.",
      sentenceArabic: "يجب على الحكومة اتخاذ إجراء فوري.",
    },
    {
      english: "immigrant",
      arabic: "مهاجر",
      sentence: "Her grandparents were immigrants to this country.",
      sentenceArabic: "كان جدّاها مهاجرين إلى هذا البلد.",
    },
    {
      english: "impact",
      arabic: "تأثير",
      sentence: "Social media has a big impact on young people.",
      sentenceArabic: "وسائل التواصل الاجتماعي لها تأثير كبير على الشباب.",
    },
    {
      english: "import",
      arabic: "يستورد",
      sentence: "The country imports most of its oil.",
      sentenceArabic: "البلد يستورد معظم نفطه.",
    },
    {
      english: "importance",
      arabic: "أهمية",
      sentence: "The teacher explained the importance of reading.",
      sentenceArabic: "شرح المعلم أهمية القراءة.",
    },
    {
      english: "impression",
      arabic: "انطباع",
      sentence: "He made a good impression at the job interview.",
      sentenceArabic: "ترك انطباعًا جيدًا في مقابلة العمل.",
    },
    {
      english: "impressive",
      arabic: "مثير للإعجاب",
      sentence: "Her knowledge of history is very impressive.",
      sentenceArabic: "معرفتها بالتاريخ مثيرة للإعجاب جدًا.",
    },
    {
      english: "improvement",
      arabic: "تحسين",
      sentence: "There has been a significant improvement in his health.",
      sentenceArabic: "كان هناك تحسن كبير في صحته.",
    },
    {
      english: "incredibly",
      arabic: "بشكل لا يصدق",
      sentence: "The movie was incredibly exciting.",
      sentenceArabic: "كان الفيلم مثيرًا بشكل لا يصدق.",
    },
    {
      english: "indeed",
      arabic: "في الواقع",
      sentence: "It was indeed a wonderful party.",
      sentenceArabic: "كانت بالفعل حفلة رائعة.",
    },
    {
      english: "indicate",
      arabic: "يشير",
      sentence: "The sign indicates the way to the hospital.",
      sentenceArabic: "تلك الإشارة تشير إلى الطريق إلى المستشفى.",
    },
    {
      english: "indirect",
      arabic: "غير مباشر",
      sentence: "She gave an indirect answer to my question.",
      sentenceArabic: "أعطت إجابة غير مباشرة على سؤالي.",
    },
    {
      english: "indoor",
      arabic: "داخلي (صفة)",
      sentence: "The school has a large indoor swimming pool.",
      sentenceArabic: "المدرسة لديها حوض سباحة داخلي كبير.",
    },
    {
      english: "indoors",
      arabic: "في الداخل (ظرف مكان)",
      sentence: "Because of the storm, we stayed indoors all day.",
      sentenceArabic: "بسبب العاصفة، بقينا في الداخل طوال اليوم.",
    },
    {
      english: "influence",
      arabic: "تأثير / يؤثر",
      sentence: "Parents have a great influence on their children.",
      sentenceArabic: "الوالدان لهما تأثير كبير على أطفالهما.",
    },
    {
      english: "ingredient",
      arabic: "مكون",
      sentence: "The main ingredients for this recipe are chicken and rice.",
      sentenceArabic: "المكونات الرئيسية لهذه الوصفة هي الدجاج والأرز.",
    },
    {
      english: "injure",
      arabic: "يجرح",
      sentence: "Two players were injured during the match.",
      sentenceArabic: "أصيب لاعبان during المباراة.",
    },
    {
      english: "injured",
      arabic: "مصاب",
      sentence: "The injured man was taken to hospital.",
      sentenceArabic: "تم نقل الرجل المصاب إلى المستشفى.",
    },
    {
      english: "mainly",
      arabic: "بشكل رئيسي",
      sentence: "The audience consisted mainly of students.",
      sentenceArabic: "تكون الجمهور mainly من الطلاب.",
    },
    {
      english: "mall",
      arabic: "مركز تجاري",
      sentence: "Let's meet at the shopping mall this afternoon.",
      sentenceArabic: "دعنا نلتقي في المركز التجاري هذا المساء.",
    },
    {
      english: "management",
      arabic: "إدارة",
      sentence: "Good management is essential for any company.",
      sentenceArabic: "الإدارة الجيدة ضرورية لأي شركة.",
    },
    {
      english: "market",
      arabic: "سوق",
      sentence: "There is a fruit and vegetable market in the town centre.",
      sentenceArabic: "هناك سوق للفواكه والخضروات في وسط المدينة.",
    },
    {
      english: "marketing",
      arabic: "تسويق",
      sentence: "She works in the marketing department.",
      sentenceArabic: "هي تعمل في قسم التسويق.",
    },
    {
      english: "marriage",
      arabic: "زواج",
      sentence: "Their marriage lasted for over fifty years.",
      sentenceArabic: "استمر زواجهم لأكثر من خمسين عامًا.",
    },
    {
      english: "meanwhile",
      arabic: "في هذه الأثناء",
      sentence: "I'll start cooking dinner. Meanwhile, can you set the table?",
      sentenceArabic:
        "سأبدأ في طهي العشاء. في هذه الأثناء، هل يمكنك إعداد الطاولة؟",
    },
    {
      english: "measure",
      arabic: "يقيس",
      sentence: "Can you measure the length of this table?",
      sentenceArabic: "هل يمكنك قياس طول هذه الطاولة؟",
    },
    {
      english: "mental",
      arabic: "عقلي",
      sentence: "Solving puzzles is good for your mental health.",
      sentenceArabic: "حل الألغاز مفيد لصحتك العقلية.",
    },
    {
      english: "mention",
      arabic: "يذكر",
      sentence: "He didn't mention that he was leaving.",
      sentenceArabic: "لم يذكر أنه كان سيغادر.",
    },
    {
      english: "mess",
      arabic: "فوضى",
      sentence: "Your room is a mess! Please tidy it up.",
      sentenceArabic: "غرفتك في فوضى! يرجى ترتيبها.",
    },
    {
      english: "mild",
      arabic: "معتدل / خفيف",
      sentence: "We are having a mild winter this year.",
      sentenceArabic: "نحن نعيش شتاءً معتدلًا هذا العام.",
    },
    {
      english: "painful",
      arabic: "مؤلم",
      sentence: "The injury was very painful.",
      sentenceArabic: "كانت الإصابة مؤلمة جدًا.",
    },
    {
      english: "pale",
      arabic: "باهت / شاحب",
      sentence: "She looked pale because she was ill.",
      sentenceArabic: "بدت شاحبة لأنها كانت مريضة.",
    },
    {
      english: "pan",
      arabic: "مقلاة",
      sentence: "Heat the oil in a large pan.",
      sentenceArabic: "قم بتسخين الزيت في مقلاة كبيرة.",
    },
    {
      english: "participate",
      arabic: "يشارك",
      sentence: "All students are encouraged to participate in the discussion.",
      sentenceArabic: "يتم تشجيع جميع الطلاب على المشاركة في المناقشة.",
    },
    {
      english: "particularly",
      arabic: "خصوصًا",
      sentence: "I like all fruit, particularly apples.",
      sentenceArabic: "أحب جميع الفواكه، particularly التفاح.",
    },
    {
      english: "pass",
      arabic: "يمر / يجتاز",
      sentence: "Please let me pass, I'm in a hurry.",
      sentenceArabic: "من فضلك دعني أمر، أنا مستعجل.",
    },
    {
      english: "passion",
      arabic: "شغف",
      sentence: "Music is his great passion.",
      sentenceArabic: "الموسيقى هي شغفه الكبير.",
    },
    {
      english: "path",
      arabic: "مسار / طريق",
      sentence: "We walked along a narrow path through the forest.",
      sentenceArabic: "مشينا على طول مسار ضيق through الغابة.",
    },
    {
      english: "payment",
      arabic: "دفع",
      sentence: "You can make the payment by credit card.",
      sentenceArabic: "يمكنك realizar الدفع ببطاقة الائتمان.",
    },
    {
      english: "peaceful",
      arabic: "سلمي / هادئ",
      sentence: "It's so peaceful here in the countryside.",
      sentenceArabic: "إنه هادئ جدًا هنا في الريف.",
    },
    {
      english: "percentage",
      arabic: "نسبة مئوية",
      sentence: "A large percentage of the population owns a mobile phone.",
      sentenceArabic: "نسبة مئوية كبيرة من السكان يمتلكون هاتفًا محمولاً.",
    },
    {
      english: "perfectly",
      arabic: "بشكل مثالي",
      sentence: "She speaks English perfectly.",
      sentenceArabic: "هي تتحدث الإنجليزية بشكل مثالي.",
    },
    {
      english: "performance",
      arabic: "أداء",
      sentence: "The actor's performance was amazing.",
      sentenceArabic: "كان أداء الممثل مذهلاً.",
    },
    {
      english: "personally",
      arabic: "شخصيًا",
      sentence: "Personally, I prefer summer to winter.",
      sentenceArabic: "شخصيًا، أنا أفضل الصيف على الشتاء.",
    },
    {
      english: "persuade",
      arabic: "يقنع",
      sentence: "He tried to persuade me to change my mind.",
      sentenceArabic: "حاول إقناعي بتغيير رأيي.",
    },
    {
      english: "reality",
      arabic: "واقع",
      sentence: "In reality, the situation is much more complicated.",
      sentenceArabic: "في الواقع، الموقف أكثر تعقيدًا بكثير.",
    },
    {
      english: "receipt",
      arabic: "إيصال",
      sentence: "Keep the receipt in case you need to return the product.",
      sentenceArabic: "احتفظ بالإيصال في حالة احتياجك لإرجاع المنتج.",
    },
    {
      english: "recommendation",
      arabic: "توصية",
      sentence: "I bought this book on your recommendation.",
      sentenceArabic: "اشتريت هذا الكتاب بناءً على توصيتك.",
    },
    {
      english: "reference",
      arabic: "مرجع",
      sentence: "You will find more information in the reference book.",
      sentenceArabic: "ستجد المزيد من المعلومات في الكتاب المرجعي.",
    },
    {
      english: "reflect",
      arabic: "يعكس / يتأمل",
      sentence: "The lake reflects the mountains beautifully.",
      sentenceArabic: "تعكس البحيرة الجبال beautifully.",
    },
    {
      english: "regularly",
      arabic: "بانتظام",
      sentence: "He exercises regularly to stay healthy.",
      sentenceArabic: "يمارس الرياضة بانتظام ليحافظ على صحته.",
    },
    {
      english: "reject",
      arabic: "يرفض",
      sentence: "The company rejected my job application.",
      sentenceArabic: "رفضت الشركة طلبي للوظيفة.",
    },
    {
      english: "relate",
      arabic: "يربط / يتعلق",
      sentence: "The story relates the adventures of a young boy.",
      sentenceArabic: "تروي القصة مغامرات فتى صغير.",
    },
    {
      english: "related",
      arabic: "ذو صلة / مرتبط",
      sentence: "The two events are not related.",
      sentenceArabic: "الحدثان غير مرتبطين.",
    },
    {
      english: "relation",
      arabic: "علاقة",
      sentence: "What is your relation to this person?",
      sentenceArabic: "ما هي علاقتك بهذا الشخص؟",
    },
    {
      english: "relative",
      arabic: "قريب (شخص)",
      sentence: "Many relatives came to the wedding.",
      sentenceArabic: "حضر العديد من الأقارب إلى حفل الزفاف.",
    },
    {
      english: "relaxed",
      arabic: "مرتاح / مسترخٍ",
      sentence: "I feel very relaxed after my holiday.",
      sentenceArabic: "أشعر بالاسترخاء بعد عطلتي.",
    },
    {
      english: "relaxing",
      arabic: "مريح / يسترخي",
      sentence: "We spent a relaxing day on the beach.",
      sentenceArabic: "قضينا يومًا مريحًا على الشاطئ.",
    },
    {
      english: "release",
      arabic: "يطلق سراح / يصدر",
      sentence: "The band will release their new album next month.",
      sentenceArabic: "ستصدر الفرقة ألبومها الجديد الشهر المقبل.",
    },
    {
      english: "reliable",
      arabic: "موثوق",
      sentence: "He is a reliable friend; you can always count on him.",
      sentenceArabic: "إنه صديق موثوق؛ يمكنك دائمًا الاعتماد عليه.",
    },
    {
      english: "religion",
      arabic: "دين",
      sentence: "People should be free to practice their religion.",
      sentenceArabic: "يجب أن يكون الناس أحرارًا في ممارسة دينهم.",
    },
    {
      english: "religious",
      arabic: "ديني",
      sentence: "They are very religious and go to church every week.",
      sentenceArabic: "هم متدينون جدًا ويذهبون إلى الكنيسة every week.",
    },
    {
      english: "remain",
      arabic: "يبقى",
      sentence: "Please remain seated until the bus stops.",
      sentenceArabic: "يرجى البقاء جالسًا until تتوقف الحافلة.",
    },
    {
      english: "remind",
      arabic: "يذكر",
      sentence: "Can you remind me to call my mother later?",
      sentenceArabic: "هل يمكنك أن تذكرني بالاتصال بأمي لاحقًا؟",
    },
    {
      english: "remote",
      arabic: "نائي / بعيد",
      sentence: "They live in a remote village in the mountains.",
      sentenceArabic: "هم يعيشون في قرية نائية في الجبال.",
    },
    {
      english: "rent",
      arabic: "إيجار / يستأجر",
      sentence: "How much do you pay in rent each month?",
      sentenceArabic: "كم تدفع من إيجار كل شهر؟",
    },
    {
      english: "repair",
      arabic: "إصلاح / يصلح",
      sentence: "The mechanic will repair my car tomorrow.",
      sentenceArabic: "سيقوم الميكانيكي بإصلاح سيارتي غدًا.",
    },
    {
      english: "repeat",
      arabic: "يكرر",
      sentence: "Could you repeat that, please? I didn't hear you.",
      sentenceArabic: "هل يمكنك تكرار ذلك من فضلك؟ لم أسمعك.",
    },
    {
      english: "repeated",
      arabic: "مكرر",
      sentence: "His repeated mistakes annoyed the teacher.",
      sentenceArabic: "أخطاؤه المكررة أزعجت المعلم.",
    },
    {
      english: "represent",
      arabic: "يمثل",
      sentence: "This painting represents a beautiful landscape.",
      sentenceArabic: "تمثل هذه اللوحة منظرًا طبيعيًا جميلاً.",
    },
    {
      english: "similarly",
      arabic: "بالمثل",
      sentence:
        "She is very talented. Similarly, her brother is a great musician.",
      sentenceArabic: "هي موهوبة جدًا. بالمثل، شقيقها موسيقي رائع.",
    },
    {
      english: "simply",
      arabic: "ببساطة",
      sentence: "The instructions are simply written and easy to follow.",
      sentenceArabic: "التعليمات مكتوبة ببساطة وسهلة المتابعة.",
    },
    {
      english: "since",
      arabic: "منذ",
      sentence: "I have lived here since 2010.",
      sentenceArabic: "أنا أعيش هنا since عام 2010.",
    },
    {
      english: "sink",
      arabic: "حوض / يغرق",
      sentence: "Wash the dishes in the sink, please.",
      sentenceArabic: "اغسل الصحون في الحوض من فضلك.",
    },
    {
      english: "slice",
      arabic: "شريحة / يقطع شرائح",
      sentence: "Would you like a slice of cake?",
      sentenceArabic: "هل تريد شريحة من الكعكة؟",
    },
    {
      english: "slightly",
      arabic: "قليلاً",
      sentence: "The weather is slightly warmer today.",
      sentenceArabic: "الطقس today أكثر دفئًا قليلاً.",
    },
    {
      english: "slow",
      arabic: "بطيء",
      sentence: "The internet connection is very slow today.",
      sentenceArabic: "اتصال الإنترنت بطيء جدًا today.",
    },
    {
      english: "smart",
      arabic: "ذكي / أنيق",
      sentence: "She is very smart and always gets good grades.",
      sentenceArabic: "هي ذكية جدًا وتحصل دائمًا on درجات جيدة.",
    },
    {
      english: "smooth",
      arabic: "ناعم / سلس",
      sentence: "The road is very smooth after being repaired.",
      sentenceArabic: "الطريق سلس جدًا after إصلاحه.",
    },
    {
      english: "software",
      arabic: "برمجيات",
      sentence: "This software helps you learn new languages.",
      sentenceArabic: "هذه البرمجيات تساعدك على تعلم لغات جديدة.",
    },
    {
      english: "soil",
      arabic: "تربة",
      sentence: "Plants need good soil to grow well.",
      sentenceArabic: "تحتاج النباتات إلى تربة جيدة لتنمو جيدًا.",
    },
    {
      english: "solid",
      arabic: "صلب",
      sentence: "Ice is the solid form of water.",
      sentenceArabic: "الجليد هو الشكل الصلب للماء.",
    },
    {
      english: "apart",
      arabic: "منفصل / بعيدًا",
      sentence: "The two houses are 500 meters apart.",
      sentenceArabic: "المنزلان يفصلهما 500 متر.",
    },
    {
      english: "apologize",
      arabic: "يعتذر",
      sentence: "You should apologize for being late.",
      sentenceArabic: "يجب أن تعتذر عن التأخر.",
    },
    {
      english: "application",
      arabic: "طلب / تطبيق",
      sentence: "I filled out an application for a new passport.",
      sentenceArabic: "ملأت طلبًا للحصول على جواز سفر جديد.",
    },
    {
      english: "appointment",
      arabic: "موعد",
      sentence: "I have a doctor's appointment at 3 o'clock.",
      sentenceArabic: "لدي موعد with الطبيب في الساعة الثالثة.",
    },
    {
      english: "appreciate",
      arabic: "يقدر",
      sentence: "I really appreciate your help.",
      sentenceArabic: "أنا أقدر حقًا مساعدتك.",
    },
    {
      english: "approximately",
      arabic: "تقريبًا",
      sentence: "The journey takes approximately two hours.",
      sentenceArabic: "تستغرق الرحلة approximately ساعتين.",
    },
    {
      english: "arrest",
      arabic: "يقبض على",
      sentence: "The police arrested the thief.",
      sentenceArabic: "قبضت الشرطة على اللص.",
    },
    {
      english: "arrival",
      arabic: "وصول",
      sentence: "We are waiting for the arrival of the train.",
      sentenceArabic: "نحن في انتظار arrival القطار.",
    },
    {
      english: "assignment",
      arabic: "مهمة / واجب",
      sentence: "The teacher gave us a new assignment.",
      sentenceArabic: "أعطانا المعلم assignment جديدًا.",
    },
    {
      english: "assist",
      arabic: "يساعد",
      sentence: "Can you assist me with this heavy box?",
      sentenceArabic: "هل يمكنك مساعدتي with هذا الصندوق الثقيل؟",
    },
    {
      english: "atmosphere",
      arabic: "جو",
      sentence: "The atmosphere in the room was very tense.",
      sentenceArabic: "كان الجو في الغرفة متوترًا جدًا.",
    },
    {
      english: "attach",
      arabic: "يرفق / يعلق",
      sentence: "Please attach the file to your email.",
      sentenceArabic: "يرجى إرفاق الملف برسالتك الإلكترونية.",
    },
    {
      english: "tail",
      arabic: "ذيل",
      sentence: "The dog was wagging its tail.",
      sentenceArabic: "كان الكلب يهز ذيله.",
    },
    {
      english: "talent",
      arabic: "موهبة",
      sentence: "She has a great talent for singing.",
      sentenceArabic: "لديها موهبة رائعة في الغناء.",
    },
    {
      english: "talented",
      arabic: "موهوب",
      sentence: "He is a very talented football player.",
      sentenceArabic: "إنه لاعب كرة قدم موهوب جدًا.",
    },
    {
      english: "tape",
      arabic: "شريط",
      sentence: "I used tape to stick the poster to the wall.",
      sentenceArabic: "استخدمت شريطًا لصق الملصق on الحائط.",
    },
    {
      english: "tax",
      arabic: "ضريبة",
      sentence: "We have to pay tax on our income.",
      sentenceArabic: "علينا دفع ضريبة on دخلنا.",
    },
    {
      english: "technical",
      arabic: "تقني",
      sentence: "We are having some technical problems with the computer.",
      sentenceArabic: "نواجه بعض المشاكل التقنية with الكمبيوتر.",
    },
    {
      english: "technique",
      arabic: "تقنية",
      sentence: "The artist uses a special technique in his paintings.",
      sentenceArabic: "يستخدم الفنان تقنية خاصة in لوحاته.",
    },
    {
      english: "tend",
      arabic: "يميل",
      sentence: "I tend to get tired easily.",
      sentenceArabic: "أميل إلى الشعور بالتعب easily.",
    },
    {
      english: "tent",
      arabic: "خيمة",
      sentence: "We slept in a tent during our camping trip.",
      sentenceArabic: "نمنا في خيمة during رحلة التخييم.",
    },
    {
      english: "that",
      arabic: "ذلك",
      sentence: "Look at that beautiful bird!",
      sentenceArabic: "انظر إلى ذلك الطائر الجميل!",
    },
    {
      english: "theirs",
      arabic: "خاصتهم",
      sentence: "This book is theirs, not ours.",
      sentenceArabic: "هذا الكتاب خاصتهم، وليس خاصتنا.",
    },
    {
      english: "theme",
      arabic: "موضوع",
      sentence: "The theme of the party is 'the 1980s'.",
      sentenceArabic: "موضوع الحفلة هو 'الثمانينيات'.",
    },
    {
      english: "theory",
      arabic: "نظرية",
      sentence: "In theory, the plan should work.",
      sentenceArabic: "نظريًا، يجب أن تنجح الخطة.",
    },
    {
      english: "therefore",
      arabic: "لذلك",
      sentence: "It was raining heavily. Therefore, we stayed at home.",
      sentenceArabic: "كان المطر غزيرًا. لذلك، بقينا في المنزل.",
    },
    {
      english: "this",
      arabic: "هذا",
      sentence: "This is my favourite song.",
      sentenceArabic: "هذه هي أغنيتي المفضلة.",
    },
    {
      english: "warm",
      arabic: "دافئ",
      sentence: "The weather is warm and sunny today.",
      sentenceArabic: "الطقس today دافئ ومشمس.",
    },
    {
      english: "warn",
      arabic: "يحذر",
      sentence: "I warned him not to touch the hot stove.",
      sentenceArabic: "حذرته من عدم لمس الموقد الساخن.",
    },
    {
      english: "warning",
      arabic: "تحذير",
      sentence: "The government issued a weather warning.",
      sentenceArabic: "أصدرت الحكومة تحذيرًا من الطقس.",
    },
    {
      english: "waste",
      arabic: "يضيع / نفايات",
      sentence: "Don't waste water; it's precious.",
      sentenceArabic: "لا تضيع الماء؛ إنه ثمين.",
    },
    {
      english: "water",
      arabic: "ماء",
      sentence: "Plants need water and sunlight to grow.",
      sentenceArabic: "تحتاج النباتات إلى الماء وأشعة الشمس لتنمو.",
    },
    {
      english: "wave",
      arabic: "موجة / يلوح",
      sentence: "The waves were very high at the beach today.",
      sentenceArabic: "كانت الأمواج very high على الشاطئ today.",
    },
    {
      english: "weapon",
      arabic: "سلاح",
      sentence: "The police found a weapon in his car.",
      sentenceArabic: "وجدت الشرطة سلاحًا in سيارته.",
    },
    {
      english: "weigh",
      arabic: "يزن",
      sentence: "How much do you weigh?",
      sentenceArabic: "كم وزنك؟",
    },
    {
      english: "western",
      arabic: "غربي",
      sentence: "I enjoy watching western movies.",
      sentenceArabic: "أستمتع بمشاهدة الأفلام الغربية.",
    },
    {
      english: "whatever",
      arabic: "أيًا كان",
      sentence: "You can choose whatever you like from the menu.",
      sentenceArabic: "يمكنك اختيار أيًا كان what you like from القائمة.",
    },
    {
      english: "whenever",
      arabic: "متىما",
      sentence: "You can call me whenever you need help.",
      sentenceArabic: "يمكنك الاتصال بي whenever تحتاج إلى مساعدة.",
    },
    {
      english: "whether",
      arabic: "سواء",
      sentence: "I don't know whether I should go or not.",
      sentenceArabic: "لا أعرف whether يجب أن أذهب أم لا.",
    },
    {
      english: "while",
      arabic: "بينما",
      sentence: "I listened to music while I was cooking.",
      sentenceArabic: "استمعت إلى الموسيقى while كنت أطبخ.",
    },
    {
      english: "whole",
      arabic: "كامل",
      sentence: "I spent the whole day cleaning the house.",
      sentenceArabic: "قضيت اليوم كله في تنظيف المنزل.",
    },
    {
      english: "will",
      arabic: "سوف / إرادة",
      sentence: "I will call you tomorrow.",
      sentenceArabic: "سأتصل بك غدًا.",
    },
    {
      english: "win",
      arabic: "يفوز",
      sentence: "I hope our team wins the match.",
      sentenceArabic: "آمل أن يفوز فريقنا بالمباراة.",
    },
    {
      english: "careless",
      arabic: "مهمل",
      sentence: "He is very careless with his belongings.",
      sentenceArabic: "إنه مهمل جدًا with متعلقاته.",
    },
    {
      english: "category",
      arabic: "فئة",
      sentence: "This book falls into the category of science fiction.",
      sentenceArabic: "يقع هذا الكتاب في فئة الخيال العلمي.",
    },
    {
      english: "ceiling",
      arabic: "سقف",
      sentence: "The ceiling in this room is very high.",
      sentenceArabic: "السقف في هذه الغرفة very high.",
    },
    {
      english: "celebration",
      arabic: "احتفال",
      sentence: "There will be a big celebration for her birthday.",
      sentenceArabic: "سيكون هناك احتفال كبير for عيد ميلادها.",
    },
    {
      english: "central",
      arabic: "مركزي",
      sentence: "The hotel is in a central location.",
      sentenceArabic: "الفندق في موقع مركزي.",
    },
    {
      english: "centre",
      arabic: "مركز",
      sentence: "There is a large shopping centre in the city.",
      sentenceArabic: "هناك مركز تسوق كبير in المدينة.",
    },
    {
      english: "ceremony",
      arabic: "حفل",
      sentence: "The wedding ceremony was beautiful.",
      sentenceArabic: "كان حفل الزفاف جميلاً.",
    },
    {
      english: "champion",
      arabic: "بطل",
      sentence: "She is the swimming champion of her school.",
      sentenceArabic: "هي بطلة السباحة in مدرستها.",
    },
    {
      english: "channel",
      arabic: "قناة",
      sentence: "Which channel is the news on?",
      sentenceArabic: "on أي قناة تكون الأخبار؟",
    },
    {
      english: "chapter",
      arabic: "فصل",
      sentence: "We are studying chapter five today.",
      sentenceArabic: "نحن ندرس الفصل الخامس today.",
    },
    {
      english: "charge",
      arabic: "يشحن / يتقاضى سعرًا",
      sentence: "How much do you charge for a haircut?",
      sentenceArabic: "كم تتقاضى for قصة الشعر؟",
    },
    {
      english: "cheap",
      arabic: "رخيص",
      sentence: "The food at this restaurant is cheap and delicious.",
      sentenceArabic: "الطعام في هذا المطعم رخيص ولذيذ.",
    },
    {
      english: "cheat",
      arabic: "يغش",
      sentence: "It's wrong to cheat in exams.",
      sentenceArabic: "من الخطأ الغش في الامتحانات.",
    },
    {
      english: "cheerful",
      arabic: "مبتهج",
      sentence: "She has a cheerful personality.",
      sentenceArabic: "لديها شخصية مبتهجة.",
    },
    {
      english: "chemical",
      arabic: "كيميائي",
      sentence: "Be careful with those chemical products.",
      sentenceArabic: "كن حذرًا with تلك المنتجات الكيميائية.",
    },
    {
      english: "chest",
      arabic: "صدر",
      sentence: "He felt a pain in his chest.",
      sentenceArabic: "شعر بألم in صدره.",
    },
    {
      english: "childhood",
      arabic: "طفولة",
      sentence: "I have many happy memories from my childhood.",
      sentenceArabic: "لدي many ذكريات سعيدة from طفولتي.",
    },
    {
      english: "claim",
      arabic: "يدعي / مطالبة",
      sentence: "He claims that he saw a UFO.",
      sentenceArabic: "يدعي أنه رأى جسمًا طائرًا مجهولاً.",
    },
    {
      english: "decade",
      arabic: "عقد",
      sentence: "Prices have risen significantly over the past decade.",
      sentenceArabic: "ارتفعت الأسعار significantly over العقد الماضي.",
    },
    {
      english: "decorate",
      arabic: "يزين",
      sentence: "We will decorate the Christmas tree together.",
      sentenceArabic: "سوف نزين شجرة الكريسماس together.",
    },
    {
      english: "deep",
      arabic: "عميق",
      sentence: "The lake is very deep in the middle.",
      sentenceArabic: "البحيرة very deep in المنتصف.",
    },
    {
      english: "define",
      arabic: "يعرف",
      sentence: "Can you define this word for me?",
      sentenceArabic: "هل يمكنك تعريف هذه الكلمة for لي؟",
    },
    {
      english: "definite",
      arabic: "محدد / مؤكد",
      sentence: "We need a definite answer by tomorrow.",
      sentenceArabic: "نحتاج إلى إجابة مؤكدة by غدًا.",
    },
    {
      english: "definition",
      arabic: "تعريف",
      sentence: "What is the definition of 'happiness'?",
      sentenceArabic: "ما هو تعريف 'السعادة'؟",
    },
    {
      english: "deliver",
      arabic: "يسلم",
      sentence: "The postman delivers letters to our house every day.",
      sentenceArabic: "يُسلم ساعي البريد الرسائل to منزلنا every day.",
    },
    {
      english: "departure",
      arabic: "مغادرة",
      sentence: "The departure of the flight is delayed.",
      sentenceArabic: "مغادرة الرحلة delayed.",
    },
    {
      english: "despite",
      arabic: "على الرغم من",
      sentence: "Despite the rain, we had a good time.",
      sentenceArabic: "على الرغم من المطر، أمضينا وقتًا ممتعًا.",
    },
    {
      english: "destination",
      arabic: "وجهة",
      sentence: "Paris is our final destination.",
      sentenceArabic: "باريس هي وجهتنا النهائية.",
    },
    {
      english: "determine",
      arabic: "يحدد",
      sentence: "We must determine the cause of the problem.",
      sentenceArabic: "يجب علينا تحديد المشكلة",
    },
    {
      english: "determined",
      arabic: "مصمم",
      sentence: "She is determined to succeed.",
      sentenceArabic: "هي مصممة على النجاح.",
    },
    {
      english: "development",
      arabic: "تطور",
      sentence: "The development of new technology is rapid.",
      sentenceArabic: "تطور التكنولوجيا الجديدة سريع.",
    },
    {
      english: "diagram",
      arabic: "رسم بياني",
      sentence: "The teacher drew a diagram on the board.",
      sentenceArabic: "رسم المعلم رسمًا بيانيًا on اللوحة.",
    },
    {
      english: "diamond",
      arabic: "ماس",
      sentence: "Her ring has a beautiful diamond.",
      sentenceArabic: "خاتمها contains ماسة جميلة.",
    },
    {
      english: "expand",
      arabic: "يوسع",
      sentence: "The company plans to expand its business.",
      sentenceArabic: "تخطط الشركة لتوسيع أعمالها.",
    },
    {
      english: "expected",
      arabic: "متوقع",
      sentence: "The expected arrival time is 8 PM.",
      sentenceArabic: "وقت الوصول المتوقع is 8 مساءً.",
    },
    {
      english: "expedition",
      arabic: "رحلة استكشافية",
      sentence: "They went on an expedition to the North Pole.",
      sentenceArabic: "ذهبوا في رحلة استكشافية to القطب الشمالي.",
    },
    {
      english: "experience",
      arabic: "خبرة / تجربة",
      sentence: "She has a lot of experience in teaching.",
      sentenceArabic: "لديها many خبرة in التدريس.",
    },
    {
      english: "experienced",
      arabic: "ذو خبرة",
      sentence: "We need an experienced engineer for this job.",
      sentenceArabic: "نحتاج إلى مهندس ذي خبرة for هذه الوظيفة.",
    },
    {
      english: "experiment",
      arabic: "تجربة",
      sentence: "We did a science experiment in class today.",
      sentenceArabic: "أجرينا تجربة علمية in الفصل today.",
    },
    {
      english: "explode",
      arabic: "ينفجر",
      sentence: "The bomb could explode at any moment.",
      sentenceArabic: "يمكن للقنبلة أن تنفجر at أي لحظة.",
    },
    {
      english: "explore",
      arabic: "يستكشف",
      sentence: "Children love to explore new places.",
      sentenceArabic: "يحب الأطفال استكشاف الأماكن الجديدة.",
    },
    {
      english: "explosion",
      arabic: "انفجار",
      sentence: "There was a loud explosion in the distance.",
      sentenceArabic: "كان هناك انفجار loud in المسافة.",
    },
    {
      english: "export",
      arabic: "يصدّر",
      sentence: "The country exports oil to other nations.",
      sentenceArabic: "يصدّر البلد النفط to دول أخرى.",
    },
    {
      english: "extra",
      arabic: "إضافي",
      sentence: "I need some extra time to finish this work.",
      sentenceArabic: "أحتاج إلى some وقت إضافي لإنهاء هذا العمل.",
    },
    {
      english: "face",
      arabic: "وجه / يواجه",
      sentence: "She has a beautiful face.",
      sentenceArabic: "لديها وجه جميل.",
    },
    {
      english: "fairly",
      arabic: "بإنصاف / إلى حد ما",
      sentence: "The teacher treated all students fairly.",
      sentenceArabic: "عامل المعلم جميع الطلاب fairly.",
    },
    {
      english: "familiar",
      arabic: "مألوف",
      sentence: "That song sounds familiar.",
      sentenceArabic: "تلك الأغنية تبدو مألوفة.",
    },
    {
      english: "fancy",
      arabic: "فاخر / يرغب",
      sentence: "Do you fancy going to the cinema tonight?",
      sentenceArabic: "هل ترغب في الذهاب إلى السينما tonight؟",
    },
    {
      english: "far",
      arabic: "بعيد",
      sentence: "How far is the airport from here?",
      sentenceArabic: "كم يبعد المطار from هنا؟",
    },
    {
      english: "fascinating",
      arabic: "ساحر / رائع",
      sentence: "The history of ancient Egypt is fascinating.",
      sentenceArabic: "تاريخ مصر القديمة رائع.",
    },
    {
      english: "fashionable",
      arabic: "عصري",
      sentence: "She always wears fashionable clothes.",
      sentenceArabic: "هي دائمًا ترتدي ملابس عصرية.",
    },
    {
      english: "fasten",
      arabic: "يربط / يثبت",
      sentence: "Please fasten your seatbelt.",
      sentenceArabic: "يرجى ربط حزام الأمان.",
    },
    {
      english: "fear",
      arabic: "خوف",
      sentence: "She has a fear of heights.",
      sentenceArabic: "لديها خوف من المرتفعات.",
    },
    {
      english: "feature",
      arabic: "ميزة",
      sentence: "The new phone has many interesting features.",
      sentenceArabic: "الهاتف الجديد لديه many ميزات مثيرة للاهتمام.",
    },
    {
      english: "heating",
      arabic: "تسخين / تدفئة",
      sentence: "We turned on the heating because it was cold.",
      sentenceArabic: "شغلنا التدفئة because كان الجو باردًا.",
    },
    {
      english: "heavily",
      arabic: "بغزارة / بشدة",
      sentence: "It was raining heavily all night.",
      sentenceArabic: "كان المطر غزيرًا all الليل.",
    },
    {
      english: "helicopter",
      arabic: "هليكوبتر",
      sentence: "A helicopter flew over our house.",
      sentenceArabic: "حلقت مروحية over منزلنا.",
    },
    {
      english: "highlight",
      arabic: "يسلط الضوء على / يبرز",
      sentence: "The report highlights the main problems.",
      sentenceArabic: "يسلط التقرير الضوء على المشاكل الرئيسية.",
    },
    {
      english: "highly",
      arabic: "بشكل كبير",
      sentence: "She is highly intelligent.",
      sentenceArabic: "هي ذكية بشكل كبير.",
    },
    {
      english: "historic",
      arabic: "تاريخي",
      sentence: "We visited a historic monument.",
      sentenceArabic: "زرنا نصبًا تاريخيًا.",
    },
    {
      english: "historical",
      arabic: "تاريخي",
      sentence: "I enjoy reading historical novels.",
      sentenceArabic: "أستمتع بقراءة الروايات التاريخية.",
    },
    {
      english: "honest",
      arabic: "صادق",
      sentence: "Please be honest with me.",
      sentenceArabic: "يرجى أن تكون صادقًا with me.",
    },
    {
      english: "horrible",
      arabic: "مروع",
      sentence: "We had horrible weather on holiday.",
      sentenceArabic: "كان طقسنا في العطلة مروعًا.",
    },
    {
      english: "horror",
      arabic: "رعب",
      sentence: "I don't like horror films.",
      sentenceArabic: "لا أحب أفلام الرعب.",
    },
    {
      english: "hurricane",
      arabic: "إعصار",
      sentence: "The hurricane caused a lot of damage.",
      sentenceArabic: "تسبب الإعصار في many damage.",
    },
    {
      english: "length",
      arabic: "طول",
      sentence: "What is the length of this room?",
      sentenceArabic: "ما طول هذه الغرفة؟",
    },
    {
      english: "lie2",
      arabic: "يكذب",
      sentence: "It is wrong to lie.",
      sentenceArabic: "من الخطأ الكذب.",
    },
    {
      english: "n.",
      arabic: "اختصار لـ Noun (اسم)",
      sentence: "The word 'book' is a n.",
      sentenceArabic: "كلمة 'كتاب' هي اسم (noun).",
    },
    {
      english: "limit",
      arabic: "حد / يحد",
      sentence: "There is a speed limit on this road.",
      sentenceArabic: "هناك حد للسرعة on هذا الطريق.",
    },
    {
      english: "lip",
      arabic: "شفة",
      sentence: "She put some cream on her lips.",
      sentenceArabic: "وضعت some كريم on شفتيها.",
    },
    {
      english: "liquid",
      arabic: "سائل",
      sentence: "Water is a liquid.",
      sentenceArabic: "الماء سائل.",
    },
    {
      english: "literature",
      arabic: "أدب",
      sentence: "I studied English literature at university.",
      sentenceArabic: "درست الأدب الإنجليزي in الجامعة.",
    },
    {
      english: "live2",
      arabic: "يعيش",
      sentence: "Where do you live?",
      sentenceArabic: "أين تعيش؟",
    },
    {
      english: "living",
      arabic: "معيشة",
      sentence: "The cost of living is high in this city.",
      sentenceArabic: "تكلفة المعيشة high في هذه المدينة.",
    },
    {
      english: "local",
      arabic: "محلي",
      sentence: "We buy our vegetables from the local market.",
      sentenceArabic: "نشتري خضرواتنا from السوق المحلي.",
    },
    {
      english: "locate",
      arabic: "يحدد موقع",
      sentence: "Can you locate your country on the map?",
      sentenceArabic: "هل يمكنك تحديد موقع بلدك on الخريطة؟",
    },
    {
      english: "located",
      arabic: "موجود",
      sentence: "The hotel is located near the beach.",
      sentenceArabic: "الفندق located near الشاطئ.",
    },
    {
      english: "location",
      arabic: "موقع",
      sentence: "This is a perfect location for a picnic.",
      sentenceArabic: "هذا موقع perfect for نزهة.",
    },
    {
      english: "lonely",
      arabic: "وحيد",
      sentence: "She felt lonely after her friends left.",
      sentenceArabic: "شعرت بالوحدة after رحيل أصدقائها.",
    },
    {
      english: "loss",
      arabic: "خسارة",
      sentence: "The company reported a loss this year.",
      sentenceArabic: "أعلنت الشركة about خسارة this العام.",
    },
    {
      english: "luxury",
      arabic: "رفاهية",
      sentence: "Staying in a five-star hotel is a luxury.",
      sentenceArabic: "الإقامة في فندق خمس نجوم هي رفاهية.",
    },
    {
      english: "mad",
      arabic: "غاضب / مجنون",
      sentence: "My father was mad at me for breaking the window.",
      sentenceArabic: "كان والدي غاضبًا fromي لكسر النافذة.",
    },
    {
      english: "magic",
      arabic: "سحر",
      sentence: "The children believed in magic.",
      sentenceArabic: "آمن الأطفال بالسحر.",
    },
    {
      english: "odd",
      arabic: "غريب",
      sentence: "That's an odd thing to say.",
      sentenceArabic: "هذا شيء غريب to say.",
    },
    {
      english: "old-fashioned",
      arabic: "عتيق الطراز",
      sentence: "She wears old-fashioned clothes.",
      sentenceArabic: "هي ترتدي ملابس عتيقة الطراز.",
    },
    {
      english: "once",
      arabic: "مرة واحدة",
      sentence: "I have been to London once.",
      sentenceArabic: "لقد ذهبت إلى لندن once.",
    },
    {
      english: "operation",
      arabic: "عملية",
      sentence: "The doctor performed a successful operation.",
      sentenceArabic: "أجرى الطبيب عملية ناجحة.",
    },
    {
      english: "organized",
      arabic: "منظم",
      sentence: "She is a very organized person.",
      sentenceArabic: "هي شخصية very منظمة.",
    },
    {
      english: "organizer",
      arabic: "منظم",
      sentence: "He is the main organizer of the event.",
      sentenceArabic: "هو المنظم الرئيسي for الحدث.",
    },
    {
      english: "original",
      arabic: "أصلي",
      sentence: "This is the original painting; the others are copies.",
      sentenceArabic: "هذه هي اللوحة الأصلية؛ الأخرى نسخ.",
    },
    {
      english: "originally",
      arabic: "أصلاً",
      sentence: "I originally come from Spain.",
      sentenceArabic: "أنا originally from إسبانيا.",
    },
    {
      english: "ought",
      arabic: "يجب",
      sentence: "You ought to visit the doctor.",
      sentenceArabic: "يجب أن تزور الطبيب.",
    },
    {
      english: "ours",
      arabic: "خاصتنا",
      sentence: "This house is ours.",
      sentenceArabic: "هذا البيت خاصتنا.",
    },
    {
      english: "outdoor",
      arabic: "في الهواء الطلق (صفة)",
      sentence: "We enjoy outdoor activities like hiking.",
      sentenceArabic:
        "نستمتع بالأنشطة في الهواء الطلق like المشي لمسافات طويلة.",
    },
    {
      english: "outdoors",
      arabic: "في الهواء الطلق (ظرف مكان)",
      sentence: "The children are playing outdoors.",
      sentenceArabic: "الأطفال يلعبون في الهواء الطلق.",
    },
    {
      english: "pack",
      arabic: "يحزم",
      sentence: "I need to pack my suitcase for the trip.",
      sentenceArabic: "أحتاج إلى حزم حقيبتي for الرحلة.",
    },
    {
      english: "proper",
      arabic: "صحيح / مناسب",
      sentence: "Please use the proper tools for the job.",
      sentenceArabic: "يرجى استخدام الأدوات المناسبة for العمل.",
    },
    {
      english: "properly",
      arabic: "بشكل صحيح",
      sentence: "Make sure the door is closed properly.",
      sentenceArabic: "تأكد من أن الباب مغلق properly.",
    },
    {
      english: "property",
      arabic: "ملكية",
      sentence: "This building is private property.",
      sentenceArabic: "هذا المبنى is ملكية خاصة.",
    },
    {
      english: "protest",
      arabic: "احتجاج / يحتج",
      sentence: "The workers went on protest for higher wages.",
      sentenceArabic: "ذهب العمال في احتجاج for أجور أعلى.",
    },
    {
      english: "proud",
      arabic: "فخور",
      sentence: "Her parents are very proud of her.",
      sentenceArabic: "والداها فخوران بها very.",
    },
    {
      english: "prove",
      arabic: "يثبت",
      sentence: "Can you prove that you are right?",
      sentenceArabic: "هل يمكنك إثبات that أنك على حق؟",
    },
    {
      english: "pull",
      arabic: "يسحب",
      sentence: "Please help me pull this heavy box.",
      sentenceArabic: "من فضلك ساعدني في سحب هذا الصندوق الثقيل.",
    },
    {
      english: "punish",
      arabic: "يعاقب",
      sentence: "The teacher will punish the students who cheat.",
      sentenceArabic: "سيعاقب المعلم الطلاب الذين يغشون.",
    },
    {
      english: "punishment",
      arabic: "عقاب",
      sentence: "What is the punishment for this crime?",
      sentenceArabic: "ما هو العقاب for هذه الجريمة؟",
    },
    {
      english: "push",
      arabic: "يدفع",
      sentence: "You need to push the door to open it.",
      sentenceArabic: "تحتاج إلى دفع الباب toفتحه.",
    },
    {
      english: "qualification",
      arabic: "مؤهل",
      sentence: "You need the right qualifications for this job.",
      sentenceArabic: "تحتاج إلى المؤهلات المناسبة for هذه الوظيفة.",
    },
    {
      english: "qualified",
      arabic: "مؤهل",
      sentence: "She is a qualified doctor.",
      sentenceArabic: "هي طبيبة مؤهلة.",
    },
    {
      english: "qualify",
      arabic: "يؤهل",
      sentence: "This course will qualify you to teach English.",
      sentenceArabic: "هذه الدورة ستؤهلك to تدريس اللغة الإنجليزية.",
    },
    {
      english: "queue",
      arabic: "طابور / يصطف",
      sentence: "We had to queue for a long time to buy tickets.",
      sentenceArabic: "كان علينا الانتظار في وابر طويلة لشراء تذاكر.",
    },
  ],
  B2: [
    {
      english: "sympathetic",
      arabic: "متعاطف",
      sentence:
        "The teacher was very sympathetic when I explained why my homework was late.",
      sentenceArabic:
        "كان المعلم متعاطفًا للغاية عندما شرحت سبب تأخر واجبي المنزلي.",
    },
    {
      english: "visa",
      arabic: "تأشيرة",
      sentence:
        "Before you can work in that country, you must obtain a work visa.",
      sentenceArabic:
        "قبل أن تتمكن من العمل في تلك الدولة، يجب أن تحصل على تأشيرة عمل.",
    },
    {
      english: "visible",
      arabic: "مرئي",
      sentence:
        "From the top of the mountain, the entire valley was clearly visible.",
      sentenceArabic: "من قمة الجبل، كان الوادي بأكمله مرئيًا بوضوح.",
    },
    {
      english: "voluntary",
      arabic: "طوعي",
      sentence: "She does voluntary work at the animal shelter every weekend.",
      sentenceArabic:
        "هي تقوم بعمل طوعي في ملجأ الحيوانات كل عطلة نهاية الأسبوع.",
    },
    {
      english: "voting",
      arabic: "تصويت",
      sentence:
        "Online voting has made the process more accessible for many people.",
      sentenceArabic:
        "جعل التصويت عبر الإنترنت العملية في متناول عدد أكبر من الناس.",
    },
    {
      english: "wander",
      arabic: "يتجول",
      sentence: "We decided to wander through the old town without a map.",
      sentenceArabic: "قررنا أن نتجول في البلدة القديمة دون خريطة.",
    },
    {
      english: "warming",
      arabic: "احترار",
      sentence:
        "Global warming is one of the most critical issues facing our planet.",
      sentenceArabic:
        "يعد الاحترار العالمي أحد أكثر القضايا حراجة التي تواجه كوكبنا.",
    },
    {
      english: "abandon",
      arabic: "يهجر / يتخلى عن",
      sentence: "The captain gave the order to abandon the sinking ship.",
      sentenceArabic: "أعطى القبطان الأمر بالتخلي عن السفينة الغارقة.",
    },
    {
      english: "absolute",
      arabic: "مطلق",
      sentence: "The dictator had absolute power over the country.",
      sentenceArabic: "كان الديكتاتور يمتلك سلطة مطلقة على البلاد.",
    },
    {
      english: "academic",
      arabic: "أكاديمي",
      sentence:
        "Her academic achievements earned her a scholarship to a great university.",
      sentenceArabic:
        "أهّلها إنجازها الأكاديمي للحصول على منحة دراسية في جامعة رائعة.",
    },
    {
      english: "acceptable",
      arabic: "مقبول",
      sentence: "This level of noise is not acceptable in a library.",
      sentenceArabic: "مستوى الضجيج هذا غير مقبول في المكتبة.",
    },
    {
      english: "accompany",
      arabic: "يرافق",
      sentence: "May I accompany you to the event tomorrow?",
      sentenceArabic: "هل يمكنني أن أرافقك إلى الحدث غدًا؟",
    },
    {
      english: "account",
      arabic: "حساب / تقرير",
      sentence: "Please give me your account of what happened last night.",
      sentenceArabic: "أرجو أن تعطيني روايتك عما حدث الليلة الماضية.",
    },
    {
      english: "accurate",
      arabic: "دقيق",
      sentence: "The weather forecast was surprisingly accurate today.",
      sentenceArabic: "كانت توقعات الطقس دقيقة بشكل مدهش اليوم.",
    },
    {
      english: "accuse",
      arabic: "يتهم",
      sentence: "How can you accuse me of lying without any proof?",
      sentenceArabic: "كيف تتهمني بالكذب دون أي دليل؟",
    },
    {
      english: "acknowledge",
      arabic: "يعترف",
      sentence:
        "The company finally acknowledged the problem with their software.",
      sentenceArabic: "اعترفت الشركة أخيرًا بالمشكلة في برنامجها.",
    },
    {
      english: "acquire",
      arabic: "اكتساب / حيازة",
      sentence:
        "She acquired fluency in French after living in Paris for a year.",
      sentenceArabic:
        "اكتسبت الطلاقة في اللغة الفرنسية بعد проживания في باريس لمدة عام.",
    },
    {
      english: "actual",
      arabic: "فعلي",
      sentence: "The actual cost was much higher than the initial estimate.",
      sentenceArabic: "كانت التكلفة الفعلية أعلى بكثير من التقدير الأولي.",
    },
    {
      english: "adapt",
      arabic: "يتكيف",
      sentence: "Animals must adapt to their environment to survive.",
      sentenceArabic: "يجب على الحيوانات أن تتكيف مع بيئتها чтобы выжить.",
    },
    {
      english: "additional",
      arabic: "إضافي",
      sentence:
        "There will be an additional charge for luggage exceeding 20kg.",
      sentenceArabic: "ستكون هناك رسوم إضافية على الأمتعة التي تتجاوز 20 كجم.",
    },
    {
      english: "address",
      arabic: "عنوان / يتناول (قضية)",
      sentence:
        "The president will address the nation tonight on live television.",
      sentenceArabic:
        "سيتوجه الرئيس إلى الأمة الليلة على شاشة التلفزيون مباشرة.",
    },
    {
      english: "administration",
      arabic: "إدارة",
      sentence:
        "The university's administration is located in the main building.",
      sentenceArabic: "تقع إدارة الجامعة في المبنى الرئيسي.",
    },
    {
      english: "adopt",
      arabic: "يتبنى",
      sentence: "The couple decided to adopt a child from overseas.",
      sentenceArabic: "قرر الزوجان تبنّي طفل من الخارج.",
    },
    {
      english: "advance",
      arabic: "تقدم / مسبق",
      sentence:
        "You need to book your tickets well in advance during the holiday season.",
      sentenceArabic: "تحتاج إلى حجز تذاكرك مسبقًا خلال موسم العطلات.",
    },
    {
      english: "affair",
      arabic: "قضية / علاقة غرامية",
      sentence: "The minister's resignation was due to a personal affair.",
      sentenceArabic: "كان استقالة الوزير بسبب قضية شخصية.",
    },
    {
      english: "afterwards",
      arabic: "بعد ذلك",
      sentence: "We had dinner first and went to the cinema afterwards.",
      sentenceArabic: "تناولنا العشاء أولاً ثم ذهبنا إلى السينما بعد ذلك.",
    },
    {
      english: "soul",
      arabic: "روح",
      sentence: "Many believe that the soul lives on after the body dies.",
      sentenceArabic: "يعتقد الكثيرون أن الروح تبقى بعد موت الجسد.",
    },
    {
      english: "specialist",
      arabic: "أخصائي",
      sentence: "You should see a heart specialist for a second opinion.",
      sentenceArabic: "يجب أن ترى أخصائي قلب للحصول على رأي ثان.",
    },
    {
      english: "species",
      arabic: "نوع (حيواني أو نباتي)",
      sentence: "The panda is an endangered species.",
      sentenceArabic: "الباندا نوع مهدد بالانقراض.",
    },
    {
      english: "speed",
      arabic: "سرعة",
      sentence:
        "The car was travelling at a high speed when the accident happened.",
      sentenceArabic: "كانت السيارة تسير بسرعة عالية عندما وقع الحادث.",
    },
    {
      english: "spiritual",
      arabic: "روحاني",
      sentence: "Yoga provides both physical and spiritual benefits.",
      sentenceArabic: "تمنح اليوغا فوائد جسدية وروحانية.",
    },
    {
      english: "split",
      arabic: "انقسام / يشقق",
      sentence: "The committee was split on the decision, so they took a vote.",
      sentenceArabic: "انقسمت اللجنة حول القرار، لذا أجرت تصويتًا.",
    },
    {
      english: "sponsor",
      arabic: "راعي / يمول",
      sentence: "A major tech company agreed to sponsor the science fair.",
      sentenceArabic: "وافقت شركة تقنية كبرى على رعاية المعرض العلمي.",
    },
    {
      english: "spot",
      arabic: "بقعة / يكتشف",
      sentence:
        "It's difficult to spot the difference between the two pictures.",
      sentenceArabic: "من الصعب اكتشاف الفرق بين الصورتين.",
    },
    {
      english: "spread",
      arabic: "انتشار / ينتشر",
      sentence:
        "Firefighters worked hard to prevent the fire from spreading to other buildings.",
      sentenceArabic:
        "عمل رجال الإطفاء بجد لمنع انتشار الحريق إلى المباني الأخرى.",
    },
    {
      english: "stable",
      arabic: "مستقر",
      sentence: "After the medication, the patient's condition is now stable.",
      sentenceArabic: "بعد الدواء، أصبح состояние المريض مستقرًا الآن.",
    },
    {
      english: "stage",
      arabic: "مرحلة / منصة",
      sentence: "The project is still in its early stages.",
      sentenceArabic: "لا يزال المشروع في مراحله المبكرة.",
    },
    {
      english: "stand",
      arabic: "يقف / موقف",
      sentence: "I cannot stand people who are constantly late.",
      sentenceArabic: "لا أطيق الأشخاص الذين يتأخرون constantly.",
    },
    {
      english: "stare",
      arabic: "يحدق",
      sentence: "It's rude to stare at people.",
      sentenceArabic: "من الوقاحة التحديق في الناس.",
    },
    {
      english: "status",
      arabic: "حالة / مكانة",
      sentence: "What is your current marital status?",
      sentenceArabic: "ما هي حالتك الاجتماعية الحالية؟",
    },
    {
      english: "steady",
      arabic: "ثابت",
      sentence: "He held the ladder steady while she climbed up.",
      sentenceArabic: "أمسك السلم ثابتًا بينما كانت تتسلق.",
    },
    {
      english: "steel",
      arabic: "فولاذ",
      sentence: "The bridge is made of reinforced steel.",
      sentenceArabic: "الجسر مصنوع من الفولاذ المسلح.",
    },
    {
      english: "steep",
      arabic: "حاد",
      sentence: "Be careful, the hill is very steep.",
      sentenceArabic: "كن حذرًا، التلة شديدة الانحدار.",
    },
    {
      english: "step",
      arabic: "خطوة / درجة سلم",
      sentence: "Learning a language is a step-by-step process.",
      sentenceArabic: "تعلم اللغة هو عملية تدريجية (خطوة بخطوة).",
    },
    {
      english: "sticky",
      arabic: "لزج",
      sentence: "My hands are all sticky from the honey.",
      sentenceArabic: "يدي لزجة كلها من العسل.",
    },
    {
      english: "stiff",
      arabic: "قاسٍ / متصلب",
      sentence: "I have a stiff neck from sleeping in a bad position.",
      sentenceArabic: "أعاني من تصلب في الرقبة بسبب النوم في وضعية خاطئة.",
    },
    {
      english: "stock",
      arabic: "مخزون / أسهم",
      sentence: "The shop has a large stock of winter coats.",
      sentenceArabic: "المتجر لديه مخزون كبير من معاطف الشتاء.",
    },
    {
      english: "trial",
      arabic: "محاكمة / تجربة",
      sentence: "The new drug is undergoing clinical trials.",
      sentenceArabic: "الدواء الجديد يخضع لتجارب سريرية.",
    },
    {
      english: "trip",
      arabic: "رحلة / يعثر",
      sentence: "We're planning a trip to Japan next spring.",
      sentenceArabic: "نحن نخطط لرحلة إلى اليابان الربيع القادم.",
    },
    {
      english: "tropical",
      arabic: "استوائي",
      sentence: "Hawaii is known for its beautiful tropical beaches.",
      sentenceArabic: "تشتهر هاواي بشواطئها الاستوائية الجميلة.",
    },
    {
      english: "trouble",
      arabic: "مشكلة",
      sentence: "I'm having trouble connecting to the internet.",
      sentenceArabic: "أواجه مشكلة في الاتصال بالإنترنت.",
    },
    {
      english: "truly",
      arabic: "حقًا",
      sentence: "I truly believe that we can make a difference.",
      sentenceArabic: "أعتقد حقًا أنه يمكننا إحداث فرق.",
    },
    {
      english: "trust",
      arabic: "ثقة / يثق",
      sentence: "Trust is the foundation of any strong relationship.",
      sentenceArabic: "الثقة هي أساس أي علاقة قوية.",
    },
    {
      english: "try",
      arabic: "يحاول / يجرب",
      sentence: "You should try the local cuisine when you travel.",
      sentenceArabic: "يجب أن تجرب المطبخ المحلي عندما تسافر.",
    },
    {
      english: "tune",
      arabic: "لحن / يضبط",
      sentence: "I can't get that tune out of my head.",
      sentenceArabic: "لا أستطيع إخراج ذلك اللحن من رأسي.",
    },
    {
      english: "tunnel",
      arabic: "نفق",
      sentence: "The train passed through a long tunnel under the mountain.",
      sentenceArabic: "مر القطار عبر نفق طويل تحت الجبل.",
    },
    {
      english: "ultimately",
      arabic: "في النهاية",
      sentence: "Ultimately, the decision is yours to make.",
      sentenceArabic: "في النهاية، القرار يعود إليك.",
    },
    {
      english: "unconscious",
      arabic: "فاقد للوعي",
      sentence:
        "The boxer was unconscious for several minutes after the punch.",
      sentenceArabic: "كان الملاكم فاقدًا للوعي لعدة دقائق بعد اللكمة.",
    },
    {
      english: "unexpected",
      arabic: "غير متوقع",
      sentence: "Her resignation was completely unexpected.",
      sentenceArabic: "كان استقالتها غير متوقعة completely.",
    },
    {
      english: "unique",
      arabic: "فريد",
      sentence: "Each person's fingerprints are unique.",
      sentenceArabic: "بصمات أصابع كل شخص فريدة.",
    },
    {
      english: "universe",
      arabic: "كون",
      sentence: "How big is the universe?",
      sentenceArabic: "ما حجم الكون؟",
    },
    {
      english: "unknown",
      arabic: "مجهول",
      sentence: "The cause of the disease is still unknown.",
      sentenceArabic: "سبب المرض لا يزال مجهولاً.",
    },
    {
      english: "beg",
      arabic: "يتوسل / يتسول",
      sentence: "The dog begged for a piece of sausage.",
      sentenceArabic: "توسل الكلب للحصول على قطعة من السجق.",
    },
    {
      english: "being",
      arabic: "كائن / وجود",
      sentence: "Human beings are capable of great kindness and great cruelty.",
      sentenceArabic:
        "الكائنات البشرية قادرة على اللطف العظيم والقسوة العظيمة.",
    },
    {
      english: "bent",
      arabic: "منحني",
      sentence: "He used a bent piece of wire to unlock the door.",
      sentenceArabic: "استخدم قطعة سلك منحنية لفتح الباب.",
    },
    {
      english: "bet",
      arabic: "يراهن",
      sentence: "I bet it will rain later.",
      sentenceArabic: "أراهن أن المطر سيهطل لاحقًا.",
    },
    {
      english: "beyond",
      arabic: "ما وراء / أبعد من",
      sentence: "The scenery was beautiful beyond description.",
      sentenceArabic: "كان المشهد جميلًا beyond description.",
    },
    {
      english: "bill",
      arabic: "فاتورة / مشروع قانون",
      sentence: "Could we have the bill, please?",
      sentenceArabic: "هل يمكن أن نحصل على الفاتورة من فضلك؟",
    },
    {
      english: "bitter",
      arabic: "مر",
      sentence: "The coffee was too bitter for my taste.",
      sentenceArabic: "كان القهوة مرّة أكثر مما أحب.",
    },
    {
      english: "blame",
      arabic: "لوم / يلوم",
      sentence: "Don't blame me for your mistakes!",
      sentenceArabic: "لا تلومني على أخطائك!",
    },
    {
      english: "blind",
      arabic: "أعمى",
      sentence: "She is blind but lives a very independent life.",
      sentenceArabic: "هي كفيفة لكنها تعيش حياة مستقلة very much.",
    },
    {
      english: "bond",
      arabic: "رابطة / سند",
      sentence: "There is a strong bond between the twins.",
      sentenceArabic: "هناك رابطة قوية between التوأم.",
    },
    {
      english: "border",
      arabic: "حدود",
      sentence: "We crossed the border into Canada at noon.",
      sentenceArabic: "عبرنا الحدود إلى كندا at noon.",
    },
    {
      english: "concentration",
      arabic: "تركيز",
      sentence: "This game requires a great deal of concentration.",
      sentenceArabic: "هذه اللعبة تتطلب قدرًا كبيرًا من التركيز.",
    },
    {
      english: "concept",
      arabic: "مفهوم",
      sentence:
        "The concept of time is difficult for young children to understand.",
      sentenceArabic: "مفهوم الزمن صعب على الأطفال الصغار أن يفهموه.",
    },
    {
      english: "concern",
      arabic: "قلق / اهتمام",
      sentence: "My main concern is your safety.",
      sentenceArabic: "قلقي الرئيسي هو سلامتكم.",
    },
    {
      english: "concerned",
      arabic: "قلق",
      sentence: "I'm concerned about the environmental impact of this project.",
      sentenceArabic: "أنا قلق بشأن التأثير البيئي لهذا المشروع.",
    },
    {
      english: "conduct",
      arabic: "سلوك / يجري",
      sentence:
        "The experiment was conducted under strict laboratory conditions.",
      sentenceArabic: "أجريت التجربة تحت ظروف مختبرية صارمة.",
    },
    {
      english: "confidence",
      arabic: "ثقة",
      sentence: "She answered the question with great confidence.",
      sentenceArabic: "أجابت على السؤال بثقة كبيرة.",
    },
    {
      english: "conflict",
      arabic: "نزاع",
      sentence: "The two parties are in conflict over the new policy.",
      sentenceArabic: "طرفا النزاع في خلاف حول السياسة الجديدة.",
    },
    {
      english: "confusing",
      arabic: "مربك",
      sentence: "The instructions were very confusing.",
      sentenceArabic: "كانت التعليمات مربكة للغاية.",
    },
    {
      english: "conscious",
      arabic: "واعٍ",
      sentence: "He was conscious during the entire operation.",
      sentenceArabic: "كان واعيًا during العملية بأكملها.",
    },
    {
      english: "conservative",
      arabic: "محافظ",
      sentence: "His views on education are quite conservative.",
      sentenceArabic: "وجهات نظره حول التعليم محافظة إلى حد ما.",
    },
    {
      english: "consideration",
      arabic: "اعتبار",
      sentence: "We will take your proposal into consideration.",
      sentenceArabic: "سنأخذ اقتراحك في الاعتبار.",
    },
    {
      english: "consistent",
      arabic: "منسجم / ثابت",
      sentence: "Her work is always of a consistent high quality.",
      sentenceArabic: "عملها دائمًا ذو جودة عالية ثابتة.",
    },
    {
      english: "constant",
      arabic: "مستمر",
      sentence:
        "The constant noise from the construction site is driving me crazy.",
      sentenceArabic:
        "الضجيج المستمر from the construction site يدفعني للجنون.",
    },
    {
      english: "constantly",
      arabic: "باستمرار",
      sentence: "Technology is constantly changing.",
      sentenceArabic: "التكنولوجيا تتغير باستمرار.",
    },
    {
      english: "construct",
      arabic: "يبنى",
      sentence: "They plan to construct a new bridge across the river.",
      sentenceArabic: "يخططون لبناء جسر جديد across the river.",
    },
    {
      english: "construction",
      arabic: "بناء",
      sentence: "The construction of the new hospital will take two years.",
      sentenceArabic: "سيستغرق بناء المستشفى الجديد عامين.",
    },
    {
      english: "contemporary",
      arabic: "معاصر",
      sentence: "She is a fan of contemporary art.",
      sentenceArabic: "هي معجبة بالفن المعاصر.",
    },
    {
      english: "contest",
      arabic: "مسابقة",
      sentence: "He won first prize in the photography contest.",
      sentenceArabic: "فاز بالجائزة الأولى في مسابقة التصوير الفوتوغرافي.",
    },
    {
      english: "contract",
      arabic: "عقد",
      sentence: "Please read the contract carefully before you sign it.",
      sentenceArabic: "يرجى قراءة العقد بعناية before التوقيع.",
    },
    {
      english: "contribute",
      arabic: "يساهم",
      sentence: "Many factors contributed to their success.",
      sentenceArabic: "ساهمت many factors في نجاحهم.",
    },
    {
      english: "contribution",
      arabic: "مساهمة",
      sentence: "She made a significant contribution to the project.",
      sentenceArabic: "قدمت مساهمة كبيرة في المشروع.",
    },
    {
      english: "convert",
      arabic: "يحول",
      sentence: "They converted the old warehouse into apartments.",
      sentenceArabic: "حولوا المستودع القديم to شقق.",
    },
    {
      english: "convinced",
      arabic: "مقتنع",
      sentence: "I am convinced that he is telling the truth.",
      sentenceArabic: "أنا مقتنع أنه يقول الحقيقة.",
    },
    {
      english: "core",
      arabic: "جوهر / نواة",
      sentence: "The core of the argument was about money.",
      sentenceArabic: "كان جوهر النقاش حول المال.",
    },
    {
      english: "corporate",
      arabic: "شركات",
      sentence: "He climbed the corporate ladder very quickly.",
      sentenceArabic: "تسلق سلم corporate ladder بسرعة كبيرة.",
    },
    {
      english: "edit",
      arabic: "يحَرّر",
      sentence: "Could you edit my essay for grammar mistakes?",
      sentenceArabic: "هل يمكنك تحرير مقالتي من الأخطاء النحوية؟",
    },
    {
      english: "edition",
      arabic: "طبعة",
      sentence: "I have the first edition of that book.",
      sentenceArabic: "أملك الطبعة الأولى من ذلك الكتاب.",
    },
    {
      english: "efficient",
      arabic: "فعال",
      sentence: "This is a very efficient way to heat the building.",
      sentenceArabic: "هذه طريقة فعالة very much لتدفئة المبنى.",
    },
    {
      english: "elderly",
      arabic: "مسن",
      sentence: "We should show more respect to elderly people.",
      sentenceArabic: "يجب أن نظهر المزيد من الاحترام للمسنين.",
    },
    {
      english: "elect",
      arabic: "ينتخب",
      sentence: "The committee will elect a new chairperson next week.",
      sentenceArabic: "ستنتخب اللجنة رئيسًا جديدًا الأسبوع القادم.",
    },
    {
      english: "elsewhere",
      arabic: "في مكان آخر",
      sentence: "The restaurant was full, so we had to go elsewhere.",
      sentenceArabic: "كان المطعم ممتلئًا، so اضطررنا للذهاب إلى مكان آخر.",
    },
    {
      english: "emerge",
      arabic: "يبرز / يظهر",
      sentence: "New evidence emerged during the investigation.",
      sentenceArabic: "برزت أدلة جديدة during البحث.",
    },
    {
      english: "emotional",
      arabic: "عاطفي",
      sentence: "It was an emotional reunion after ten years apart.",
      sentenceArabic: "كان اللقاء عاطفيًا after ten years of separation.",
    },
    {
      english: "emphasis",
      arabic: "تركيز / تشديد",
      sentence: "The course puts a lot of emphasis on practical skills.",
      sentenceArabic: "تركز الدورة heavily على المهارات العملية.",
    },
    {
      english: "emphasize",
      arabic: "يشدد",
      sentence: "I must emphasize the importance of being on time.",
      sentenceArabic: "يجب أن أشدد on أهمية being on time.",
    },
    {
      english: "enable",
      arabic: "يمكن / يتيح",
      sentence: "This software will enable you to create professional designs.",
      sentenceArabic: "هذا البرنامج سيمكنك from إنشاء تصاميم احترافية.",
    },
    {
      english: "encounter",
      arabic: "يقابِل / مواجهة",
      sentence: "We encountered many problems along the way.",
      sentenceArabic: "واجهنا many problems على طول الطريق.",
    },
    {
      english: "former",
      arabic: "سابق",
      sentence: "The former president gave a speech.",
      sentenceArabic: "ألقى الرئيس السابق خطابًا.",
    },
    {
      english: "fortune",
      arabic: "ثروة / حظ",
      sentence: "He made a fortune in the stock market.",
      sentenceArabic: "جمع ثروة in سوق الأسهم.",
    },
    {
      english: "forward",
      arabic: "إلى الأمام",
      sentence: "We are looking forward to your visit.",
      sentenceArabic: "نحن نتطلع إلى زيارتكم.",
    },
    {
      english: "found",
      arabic: "يؤسس",
      sentence: "The company was founded in 1995.",
      sentenceArabic: "تأسست الشركة in 1995.",
    },
    {
      english: "free",
      arabic: "حر / مجاني",
      sentence: "The app is free to download.",
      sentenceArabic: "التطبيق مجاني للتحميل.",
    },
    {
      english: "freedom",
      arabic: "حرية",
      sentence: "Freedom of speech is a basic human right.",
      sentenceArabic: "حرية التعبير حق إنساني أساسي.",
    },
    {
      english: "frequency",
      arabic: "تردد",
      sentence: "The frequency of earthquakes in the region has increased.",
      sentenceArabic: "زاد تكرر الزلازل in the region.",
    },
    {
      english: "fuel",
      arabic: "وقود",
      sentence: "The plane had enough fuel to reach its destination.",
      sentenceArabic: "كان لدى الطائرة enough وقود للوصول to destination.",
    },
    {
      english: "fully",
      arabic: "بالكامل",
      sentence: "I fully understand your concerns.",
      sentenceArabic: "أفهم مخاوفك fully.",
    },
    {
      english: "function",
      arabic: "وظيفة / يعمل",
      sentence: "The main function of the heart is to pump blood.",
      sentenceArabic: "الوظيفة الرئيسية للقلب are ضخ الدم.",
    },
    {
      english: "fund",
      arabic: "صندوق / يمول",
      sentence: "The government will fund the new research project.",
      sentenceArabic: "ستمول الحكومة مشروع البحث الجديد.",
    },
    {
      english: "fundamental",
      arabic: "أساسي",
      sentence: "Respect is fundamental to any relationship.",
      sentenceArabic: "الاحترام أساسي لأي relationship.",
    },
    {
      english: "funding",
      arabic: "تمويل",
      sentence: "The school is seeking funding for a new library.",
      sentenceArabic: "تسعى المدرسة للحصول على تمويل for مكتبة جديدة.",
    },
    {
      english: "furthermore",
      arabic: "علاوة على ذلك",
      sentence: "The house is too small. Furthermore, it's too expensive.",
      sentenceArabic: "المنزل صغير جدًا. علاوة على ذلك، فهو غالي جدًا.",
    },
    {
      english: "gain",
      arabic: "يكسب / يربح",
      sentence: "She gained valuable experience from that job.",
      sentenceArabic: "اكتسبت خبرة قيمة from ذلك العمل.",
    },
    {
      english: "gang",
      arabic: "عصابة",
      sentence: "The police arrested several members of the gang.",
      sentenceArabic: "ألقت الشرطة القبض على several أفراد العصابة.",
    },
    {
      english: "generate",
      arabic: "يولد",
      sentence: "The dam generates enough electricity for the whole city.",
      sentenceArabic: "يولد السد enough كهرباء for المدينة بأكملها.",
    },
    {
      english: "genre",
      arabic: "نوع أدبي أو فني",
      sentence: "Science fiction is my favourite film genre.",
      sentenceArabic: "الخيال العلمي هو نوع الأفلام المفضل لدي.",
    },
    {
      english: "inner",
      arabic: "داخلي",
      sentence: "She struggled with her inner demons.",
      sentenceArabic: "عانت from شياطينها الداخلية.",
    },
    {
      english: "insight",
      arabic: "بصيرة / فهم عميق",
      sentence: "The book provides interesting insights into modern politics.",
      sentenceArabic: "يوفر الكتاب رؤى مثيرة للاهتمام into السياسة الحديثة.",
    },
    {
      english: "insist",
      arabic: "يصر",
      sentence: "He insisted on paying for dinner.",
      sentenceArabic: "أصر على دفع ثمن العشاء.",
    },
    {
      english: "inspire",
      arabic: "يلهم",
      sentence: "Her story inspired me to learn how to play the piano.",
      sentenceArabic: "ألهمتني قصتها to learn العزف على البيانو.",
    },
    {
      english: "install",
      arabic: "يثبت / ينصب",
      sentence: "We need to install a new operating system on the computer.",
      sentenceArabic: "نحن بحاجة to install نظام تشغيل جديد on الكمبيوتر.",
    },
    {
      english: "instance",
      arabic: "مثال / حالة",
      sentence: "In this instance, I think we should forgive him.",
      sentenceArabic: "في هذه الحالة، أعتقد that we should نغفر له.",
    },
    {
      english: "institute",
      arabic: "معهد",
      sentence: "She works at a research institute.",
      sentenceArabic: "هي تعمل في معهد بحثي.",
    },
    {
      english: "institution",
      arabic: "مؤسسة",
      sentence: "Banks are important financial institutions.",
      sentenceArabic: "تعد البنوك مؤسسات مالية مهمة.",
    },
    {
      english: "insurance",
      arabic: "تأمين",
      sentence: "Do you have travel insurance for your trip?",
      sentenceArabic: "هل لديك تأمين سفر for رحلتك؟",
    },
    {
      english: "intended",
      arabic: "مقصود",
      sentence: "The comment was not intended to be rude.",
      sentenceArabic: "لم يكن التعليق مقصودًا to be وقحًا.",
    },
    {
      english: "intense",
      arabic: "شديد",
      sentence: "There was intense competition for the job.",
      sentenceArabic: "كان هناك منافسة شديدة on الوظيفة.",
    },
    {
      english: "internal",
      arabic: "داخلي",
      sentence: "The company is conducting an internal investigation.",
      sentenceArabic: "تجري الشركة تحقيقًا داخليًا.",
    },
    {
      english: "interpret",
      arabic: "يفسر / يترجم",
      sentence: "How would you interpret his silence?",
      sentenceArabic: "كيف تفسر صمته؟",
    },
    {
      english: "interrupt",
      arabic: "يقاطع",
      sentence: "It's rude to interrupt people when they are speaking.",
      sentenceArabic: "من الوقاحة مقاطعة الناس when they are يتكلمون.",
    },
    {
      english: "investigation",
      arabic: "تحقيق",
      sentence: "The police have launched an investigation into the robbery.",
      sentenceArabic: "أطلقت الشرطة تحقيقًا into السرقة.",
    },
    {
      english: "investment",
      arabic: "استثمار",
      sentence: "Buying a house is a good investment.",
      sentenceArabic: "شراء منزل استثمار جيد.",
    },
    {
      english: "issue",
      arabic: "قضية / مشكلة",
      sentence: "We need to discuss this issue seriously.",
      sentenceArabic: "نحن بحاجة to discuss هذه القضية بجدية.",
    },
    {
      english: "joy",
      arabic: "بهجة",
      sentence: "Their wedding day was filled with joy.",
      sentenceArabic: "كان يوم زفافهم مليئًا بالبهجة.",
    },
    {
      english: "judgement",
      arabic: "حكم / رأي",
      sentence: "I trust your judgement on this matter.",
      sentenceArabic: "أثق في حكمك في هذه المسألة.",
    },
    {
      english: "mineral",
      arabic: "معدن",
      sentence: "Water contains essential minerals.",
      sentenceArabic: "يحتوي الماء on معادن أساسية.",
    },
    {
      english: "minimum",
      arabic: "حد أدنى",
      sentence: "You need a minimum of five years of experience for this job.",
      sentenceArabic: "تحتاج إلى حد أدنى of خمس سنوات خبرة for هذه الوظيفة.",
    },
    {
      english: "minister",
      arabic: "وزير",
      sentence: "The Minister of Education will give a speech tomorrow.",
      sentenceArabic: "سيلقي وزير التربية والتعليم خطابًا غدًا.",
    },
    {
      english: "minor",
      arabic: "ثانوي / قاصر",
      sentence: "It's just a minor problem; we can fix it easily.",
      sentenceArabic: "إنها مجرد مشكلة ثانوية؛ يمكننا إصلاحها easily.",
    },
    {
      english: "minority",
      arabic: "أقلية",
      sentence: "The rights of minorities must be protected.",
      sentenceArabic: "يجب حماية حقوق الأقليات.",
    },
    {
      english: "mission",
      arabic: "مهمة",
      sentence: "Their mission is to provide clean water to every village.",
      sentenceArabic: "مهمتهم are توفير مياه نظيفة for كل قرية.",
    },
    {
      english: "mistake",
      arabic: "خطأ",
      sentence: "Learning from your mistakes is important.",
      sentenceArabic: "التعلم من أخطائك مهم.",
    },
    {
      english: "mixed",
      arabic: "مختلط",
      sentence: "I have mixed feelings about moving to a new city.",
      sentenceArabic: "لدي مشاعر مختلطة about الانتقال إلى مدينة جديدة.",
    },
    {
      english: "model",
      arabic: "نموذج / عارض(ة)",
      sentence: "This car is the latest model.",
      sentenceArabic: "هذه السيارة are أحدث model.",
    },
    {
      english: "modify",
      arabic: "يعدل",
      sentence: "We need to modify the design slightly.",
      sentenceArabic: "نحن بحاجة to modify التصميم قليلاً.",
    },
    {
      english: "monitor",
      arabic: "يراقب / شاشة",
      sentence: "Doctors are monitoring his condition closely.",
      sentenceArabic: "يراقب الأطباء حالته closely.",
    },
    {
      english: "moral",
      arabic: "أخلاقي",
      sentence: "It's a moral obligation to help those in need.",
      sentenceArabic: "إنه واجب أخلاقي to help المحتاجين.",
    },
    {
      english: "motor",
      arabic: "محرك",
      sentence: "The motor is very powerful.",
      sentenceArabic: "المحرك قوي very much.",
    },
    {
      english: "mount",
      arabic: "جبل / يركب / يثبت",
      sentence: "We plan to mount the TV on the wall.",
      sentenceArabic: "نحن نخطط to mount التلفزيون on الحائط.",
    },
    {
      english: "multiple",
      arabic: "متعدد",
      sentence: "He suffered multiple injuries in the accident.",
      sentenceArabic: "عانى من إصابات متعددة in الحادث.",
    },
    {
      english: "multiply",
      arabic: "يضرب (في الرياضيات) / يتكاثر",
      sentence: "Cells multiply rapidly in the right conditions.",
      sentenceArabic: "تتكاثر الخلايا rapidly في الظروف المناسبة.",
    },
    {
      english: "mysterious",
      arabic: "غامض",
      sentence: "There was a mysterious package at the door.",
      sentenceArabic: "كان هناك طرد غامض at الباب.",
    },
    {
      english: "narrow",
      arabic: "ضيق",
      sentence: "The path was too narrow for the car.",
      sentenceArabic: "كان المسار ضيقًا جدًا for السيارة.",
    },
    {
      english: "national",
      arabic: "وطني",
      sentence: "The national anthem was played before the game.",
      sentenceArabic: "تم عزف النشيد الوطني before المباراة.",
    },
    {
      english: "pick",
      arabic: "يختار / يقطف",
      sentence: "You can pick any book you like from the shelf.",
      sentenceArabic: "يمكنك اختيار any كتاب you like from الرف.",
    },
    {
      english: "picture",
      arabic: "صورة",
      sentence: "She drew a picture of her family.",
      sentenceArabic: "رسمت صورة لعائلتها.",
    },
    {
      english: "pile",
      arabic: "كومة",
      sentence: "There's a pile of dirty clothes on the floor.",
      sentenceArabic: "هناك كومة من الملابس المتسخة on الأرض.",
    },
    {
      english: "pitch",
      arabic: "ملعب / رمية",
      sentence: "The football pitch was very muddy after the rain.",
      sentenceArabic: "كان ملعب كرة القدم موحلًا very much after المطر.",
    },
    {
      english: "plain",
      arabic: "عادي / سهل",
      sentence: "She was wearing a plain black dress.",
      sentenceArabic: "كانت ترتدي فستانًا أسود عاديًا.",
    },
    {
      english: "plot",
      arabic: "حبكة / مؤامرة / قطعة أرض",
      sentence: "The movie has a very complicated plot.",
      sentenceArabic: "يحتوي الفيلم on حبكة معقدة very much.",
    },
    {
      english: "plus",
      arabic: "زائد / إضافة إلى",
      sentence: "The job requires a degree plus three years of experience.",
      sentenceArabic: "تتطلب الوظيفة شهادة degree plus ثلاث سنوات خبرة.",
    },
    {
      english: "pointed",
      arabic: "مدبب",
      sentence: "He has a pointed chin.",
      sentenceArabic: "لديه ذقن مدببة.",
    },
    {
      english: "popularity",
      arabic: "شعبية",
      sentence: "The popularity of social media continues to grow.",
      sentenceArabic: "لا تزال شعبية وسائل التواصل الاجتماعي in نمو.",
    },
    {
      english: "pose",
      arabic: "يطرح / يوحي / يضع (وضعية)",
      sentence: "Smoking poses a serious risk to health.",
      sentenceArabic: "يشكل التدخين خطرًا جديًا on الصحة.",
    },
    {
      english: "position",
      arabic: "موقف / منصب / وضعية",
      sentence: "What is your position on this issue?",
      sentenceArabic: "ما هو موقفك من هذه القضية؟",
    },
    {
      english: "positive",
      arabic: "إيجابي",
      sentence: "We need to stay positive during difficult times.",
      sentenceArabic: "نحن بحاجة to stay إيجابيين during الأوقات الصعبة.",
    },
    {
      english: "possess",
      arabic: "يمتلك",
      sentence: "He possesses great wealth.",
      sentenceArabic: "هو يمتلك ثروة كبيرة.",
    },
    {
      english: "reputation",
      arabic: "سمعة",
      sentence: "The company has a reputation for high quality.",
      sentenceArabic: "الشركة لها سمعة in الجودة العالية.",
    },
    {
      english: "requirement",
      arabic: "مطلب",
      sentence: "Meeting the basic requirements is not enough.",
      sentenceArabic: "تلبية المتطلبات الأساسية ليست كافية.",
    },
    {
      english: "rescue",
      arabic: "إنقاذ",
      sentence: "The firefighter rescued the cat from the tree.",
      sentenceArabic: "أنقذ رجل الإطفاء القطة from الشجرة.",
    },
    {
      english: "reserve",
      arabic: "يحجز / احتياطي",
      sentence: "I'd like to reserve a table for two, please.",
      sentenceArabic: "أود حجز طاولة for شخصين، من فضلك.",
    },
    {
      english: "resident",
      arabic: "مقيم",
      sentence: "The residents of the building complained about the noise.",
      sentenceArabic: "اشتكى سكان المبنى from الضجيج.",
    },
    {
      english: "resist",
      arabic: "يقاوم",
      sentence: "It's hard to resist chocolate cake.",
      sentenceArabic: "من الصعب مقاومة كعكة الشوكولاتة.",
    },
    {
      english: "resolve",
      arabic: "يحل / يقرر",
      sentence: "We must resolve this conflict peacefully.",
      sentenceArabic: "يجب أن نحل هذا النزاع peacefully.",
    },
    {
      english: "resort",
      arabic: "منتجع / يلجأ",
      sentence: "We stayed at a beautiful beach resort.",
      sentenceArabic: "أقمنا في منتجع beach جميل.",
    },
    {
      english: "retain",
      arabic: "يحتفظ",
      sentence: "It's important to retain a sense of humour.",
      sentenceArabic: "من المهم الاحتفاظ بروح الدعابة.",
    },
    {
      english: "reveal",
      arabic: "يكشف",
      sentence: "The investigation revealed new facts.",
      sentenceArabic: "كشف التحقيق about وقائع جديدة.",
    },
    {
      english: "revolution",
      arabic: "ثورة",
      sentence: "The industrial revolution changed the world.",
      sentenceArabic: "غيرت الثورة الصناعية العالم.",
    },
    {
      english: "reward",
      arabic: "مكافأة",
      sentence: "Hard work brings its own reward.",
      sentenceArabic: "العمل الجاد يجلب مكافأته الخاصة.",
    },
    {
      english: "rhythm",
      arabic: "إيقاع",
      sentence: "I love the rhythm of this song.",
      sentenceArabic: "أحب إيقاع هذه الأغنية.",
    },
    {
      english: "rid",
      arabic: "يتخلص",
      sentence: "We need to get rid of these old newspapers.",
      sentenceArabic: "نحن بحاجة to get rid of these الجرائد القديمة.",
    },
    {
      english: "root",
      arabic: "جذر / أصل",
      sentence: "The root of the problem is a lack of communication.",
      sentenceArabic: "جذر المشكلة is نقص التواصل.",
    },
    {
      english: "round",
      arabic: "مستدير / جولة",
      sentence: "The moon was round and bright.",
      sentenceArabic: "كان القمر مستديرًا and ساطعًا.",
    },
    {
      english: "routine",
      arabic: "روتين",
      sentence: "My morning routine includes coffee and exercise.",
      sentenceArabic: "يتضمن روتيني الصباحي coffee and التمرين.",
    },
    {
      english: "rub",
      arabic: "يفرك",
      sentence: "She rubbed her eyes tiredly.",
      sentenceArabic: "فركت عينيها بتعب.",
    },
    {
      english: "rubber",
      arabic: "مطاط",
      sentence: "The soles of the shoes are made of rubber.",
      sentenceArabic: "نعل الحذاء مصنوع من المطاط.",
    },
    {
      english: "rural",
      arabic: "ريفي",
      sentence: "He prefers rural life to city life.",
      sentenceArabic: "يفضل الحياة الريفية on city life.",
    },
    {
      english: "absorb",
      arabic: "يمتص",
      sentence: "Plants absorb water through their roots.",
      sentenceArabic: "تمتص النباتات الماء through جذورها.",
    },
    {
      english: "abstract",
      arabic: "مجرد",
      sentence: "The artist paints abstract shapes.",
      sentenceArabic: "يرسم الفنان أشكالاً مجردة.",
    },
    {
      english: "accent",
      arabic: "لهجة",
      sentence: "She speaks English with a French accent.",
      sentenceArabic: "تتحدث الإنجليزية بلهجة فرنسية.",
    },
    {
      english: "accidentally",
      arabic: "عن طريق الخطأ",
      sentence: "I accidentally deleted the important file.",
      sentenceArabic: "حذفت الملف المهم عن طريق الخطأ.",
    },
    {
      english: "accommodate",
      arabic: "يستوعب / يلبي",
      sentence: "The hotel can accommodate up to 200 guests.",
      sentenceArabic: "يمكن أن يستوعب الفندق up to 200 ضيف.",
    },
    {
      english: "accomplish",
      arabic: "ينجز",
      sentence: "We accomplished all our goals for the year.",
      sentenceArabic: "أنجزنا all أهدافنا for العام.",
    },
    {
      english: "accountant",
      arabic: "محاسب",
      sentence: "You should ask your accountant for financial advice.",
      sentenceArabic: "يجب أن تطلب النصيحة المالية from محاسبك.",
    },
    {
      english: "accuracy",
      arabic: "دقة",
      sentence: "The accuracy of the information is crucial.",
      sentenceArabic: "دقة المعلومات crucial.",
    },
    {
      english: "accurately",
      arabic: "بدقة",
      sentence: "Please report the data accurately.",
      sentenceArabic: "يرجى الإبلاغ about البيانات بدقة.",
    },
    {
      english: "activate",
      arabic: "يفعّل",
      sentence: "You need to activate your account before you can use it.",
      sentenceArabic: "تحتاج to activate حسابك before يمكنك استخدامه.",
    },
    {
      english: "addiction",
      arabic: "إدمان",
      sentence: "He sought help for his addiction to drugs.",
      sentenceArabic: "طلب المساعدة for إدمانه on المخدرات.",
    },
    {
      english: "additionally",
      arabic: "إضافة إلى ذلك",
      sentence: "The job is interesting. Additionally, the salary is good.",
      sentenceArabic: "االوظيفة مهمة بالاضافة اى الراتب جيد",
    },
    {
      english: "interval",
      arabic: "فترة زمنية / فاصلة",
      sentence: "There was a short interval between the two meetings.",
      sentenceArabic: "كان هناك فاصل زمني قصير بين الاجتماعين.",
    },
    {
      english: "invade",
      arabic: "يغزو",
      sentence:
        "The ancient Romans used to invade other territories to expand their empire.",
      sentenceArabic:
        "كان الرومان القدماء يغزون الأراضي الأخرى لتوسيع إمبراطوريتهم.",
    },
    {
      english: "invasion",
      arabic: "غزو",
      sentence:
        "The invasion of the country was condemned by the United Nations.",
      sentenceArabic: "أدانت الأمم المتحدة غزو ذلك البلد.",
    },
    {
      english: "investor",
      arabic: "مستثمر",
      sentence:
        "The new startup is looking for a foreign investor to fund its project.",
      sentenceArabic:
        "تبحث الشركة الناشئة الجديدة عن مستثمر أجنبي لتمويل مشروعها.",
    },
    {
      english: "norm",
      arabic: "معيار / قاعدة",
      sentence: "Working from home has become the norm for many people.",
      sentenceArabic: "أصبح العمل من المنزل هو القاعدة للعديد من الناس.",
    },
    {
      english: "notebook",
      arabic: "دفتر ملاحظات",
      sentence: "She always carries a small notebook to jot down her ideas.",
      sentenceArabic: "هي دائماً تحمل دفتر ملاحظات صغير لتسجيل أفكارها.",
    },
    {
      english: "novelist",
      arabic: "روائي",
      sentence: "The famous novelist is releasing a new book next month.",
      sentenceArabic: "الروائي الشهير سيصدر كتابًا جديدًا الشهر المقبل.",
    },
    {
      english: "nowadays",
      arabic: "في الوقت الحاضر",
      sentence: "Nowadays, it's hard to imagine life without the internet.",
      sentenceArabic: "في الوقت الحاضر، من الصعب تخيل الحياة بدون الإنترنت.",
    },
    {
      english: "nursing",
      arabic: "تمريض",
      sentence:
        "She decided to pursue a career in nursing because she loves helping people.",
      sentenceArabic: "قررت أن تمتهن التمريض لأنها تحب مساعدة الناس.",
    },
    {
      english: "nutrition",
      arabic: "تغذية",
      sentence: "Good nutrition is essential for a child's development.",
      sentenceArabic: "التغذية الجيدة ضرورية لنمو الطفل.",
    },
    {
      english: "obesity",
      arabic: "سمنة مفرطة",
      sentence:
        "Obesity is a growing health problem in many developed countries.",
      sentenceArabic:
        "السمنة المفرطة مشكلة صحية متزايدة في العديد من الدول المتقدمة.",
    },
    {
      english: "observer",
      arabic: "مراقب",
      sentence:
        "International observers were present to monitor the elections.",
      sentenceArabic: "كان المراقبون الدوليون حاضرين لمراقبة الانتخابات.",
    },
    {
      english: "obstacle",
      arabic: "عقبة",
      sentence:
        "Lack of funding is the main obstacle to our project's success.",
      sentenceArabic: "عدم التمويل هو العقبة الرئيسية أمام نجاح مشروعنا.",
    },
    {
      english: "occupation",
      arabic: "احتلال / مهنة",
      sentence:
        "1. The military occupation of the region lasted for years. 2. Please state your name and occupation on the form.",
      sentenceArabic:
        "1. استمر الاحتلال العسكري للمنطقة لسنوات. 2. يرجى ذكر اسمك ومهنك في النموذج.",
    },
    {
      english: "occupy",
      arabic: "يحتل",
      sentence:
        "The students decided to occupy the administration building in protest.",
      sentenceArabic: "قرر الطلاب احتلال مبنى الإدارة احتجاجًا.",
    },
    {
      english: "offender",
      arabic: "جانٍ / مخالف",
      sentence: "The repeat offender was sentenced to a longer prison term.",
      sentenceArabic: "حُكم على المخالف المتكرر بقضاء مدة أطول في السجن.",
    },
    {
      english: "ongoing",
      arabic: "مستمر",
      sentence: "The investigation into the incident is still ongoing.",
      sentenceArabic: "التحقيق في الحادثة لا يزال مستمراً.",
    },
    {
      english: "openly",
      arabic: "بصراحة / علناً",
      sentence: "They openly discussed their disagreements during the meeting.",
      sentenceArabic: "ناقشوا خلافاتهم علناً خلال الاجتماع.",
    },
    {
      english: "opera",
      arabic: "أوبرا",
      sentence: "We went to see a famous Italian opera at the theatre.",
      sentenceArabic: "ذهبنا لمشاهدة أوبرا إيطالية مشهورة في المسرح.",
    },
    {
      english: "operator",
      arabic: "مشغّل / عامل",
      sentence: "Please hold the line while I connect you to the operator.",
      sentenceArabic: "يرجى الانتظار حتى أوصلك بالمشغل.",
    },
    {
      english: "optimistic",
      arabic: "متفائل",
      sentence: "She is optimistic about her chances of getting the job.",
      sentenceArabic: "هي متفائلة بشأن فرصها في الحصول على الوظيفة.",
    },
    {
      english: "orchestra",
      arabic: "أوركسترا",
      sentence: "The symphony orchestra performed beautifully last night.",
      sentenceArabic: "أدت الأوركسترا السمفونية بشكل رائع الليلة الماضية.",
    },
    {
      english: "organic",
      arabic: "عضوي",
      sentence: "I prefer to buy organic vegetables from the local market.",
      sentenceArabic: "أفضل شراء الخضروات العضوية من السوق المحلية.",
    },
    {
      english: "outfit",
      arabic: "زيّ / طقم ملابس",
      sentence: "She bought a new outfit for the wedding ceremony.",
      sentenceArabic: "اشترت طقم ملابس جديد لحفل الزفاف.",
    },
    {
      english: "output",
      arabic: "مخرجات / إنتاج",
      sentence: "The factory has increased its output by 20% this year.",
      sentenceArabic: "زاد المصنع إنتاجه بنسبة 20٪ هذا العام.",
    },
    {
      english: "outstanding",
      arabic: "متميز / بارز",
      sentence:
        "She received an award for her outstanding contribution to science.",
      sentenceArabic: "تلقت جائزة عن مساهمتها البارزة في العلم.",
    },
    {
      english: "overcome",
      arabic: "يتغلب على",
      sentence: "He managed to overcome his fear of public speaking.",
      sentenceArabic: "تمكن من التغلب على خوفه من التحدث أمام الجمهور.",
    },
    {
      english: "overnight",
      arabic: " بين عشية وضحاها / ليلة واحدة",
      sentence:
        "The success didn't happen overnight; it took years of hard work.",
      sentenceArabic:
        "النجاح لم يحدث بين عشية وضحاها؛ لقد استغرق سنوات من العمل الجاد.",
    },
    {
      english: "overseas",
      arabic: "في الخارج / ما وراء البحار",
      sentence: "The company has many overseas branches.",
      sentenceArabic: "الشركة لديها العديد من الفروع في الخارج.",
    },
    {
      english: "ownership",
      arabic: "ملكية",
      sentence: "The documents prove his ownership of the property.",
      sentenceArabic: "المستندات تثبت ملكيته للممتلكات.",
    },
    {
      english: "oxygen",
      arabic: "أوكسجين",
      sentence: "Mountaineers need extra oxygen when climbing very high peaks.",
      sentenceArabic:
        "يتسلقون الجبال بحاجة إلى أوكسجين إضافي عند تسلق قمم عالية جدًا.",
    },
    {
      english: "packet",
      arabic: "رزمة / علبة",
      sentence: "Could you pass me that packet of biscuits, please?",
      sentenceArabic: "هل يمكنك أن تمرر لي علبة البسكويت هذه من فضلك؟",
    },
    {
      english: "palm",
      arabic: "كف اليد / نخلة",
      sentence:
        "1. He had the answer written on the palm of his hand. 2. We relaxed under the shade of a palm tree.",
      sentenceArabic:
        "1. كان لديه الإجابة مكتوبة على كف يده. 2. استرحنا تحت ظل شجرة نخيل.",
    },
    {
      english: "panic",
      arabic: "ذعر / يُذعر",
      sentence:
        "There was a moment of panic when the lights suddenly went out.",
      sentenceArabic: "كانت هناك لحظة من الذعر عندما انطفأت الأضواء فجأة.",
    },
    {
      english: "parade",
      arabic: "موكب / استعراض",
      sentence: "The national day parade was attended by thousands of people.",
      sentenceArabic: "حضر آلاف الأشخاص استعراض العيد الوطني.",
    },
    {
      english: "parallel",
      arabic: "متوازي / مماثل",
      sentence: "The road runs parallel to the railway line.",
      sentenceArabic: "الطريق يسير بشكل متوازٍ مع خط السكة الحديد.",
    },
    {
      english: "remarkable",
      arabic: "ملحوظ / استثنائي",
      sentence: "She has made remarkable progress in her language studies.",
      sentenceArabic: "أحرزت تقدمًا ملحوظًا في دراساتها اللغوية.",
    },
    {
      english: "remarkably",
      arabic: "بشكل ملحوظ",
      sentence: "The weather was remarkably warm for this time of year.",
      sentenceArabic: "كان الطقس دافئًا بشكل ملحوظ لهذا الوقت من السنة.",
    },
    {
      english: "reporting",
      arabic: "الإبلاغ / التقارير",
      sentence: "Accurate reporting is crucial in journalism.",
      sentenceArabic: "الإبلاغ الدقيق أمر بالغ الأهمية في الصحافة.",
    },
    {
      english: "resign",
      arabic: "يستقيل",
      sentence: "The minister was forced to resign after the scandal.",
      sentenceArabic: "أُجبر الوزير على الاستقالة بعد الفضيحة.",
    },
    {
      english: "resolution",
      arabic: "قرار / عزيمة",
      sentence:
        "1. The UN passed a new resolution. 2. My New Year's resolution is to get fit.",
      sentenceArabic:
        "1. passed الأمم المتحدة قرارًا جديدًا. 2. قراري للعام الجديد هو أن أصبح لائقًا بدنيًا.",
    },
    {
      english: "restore",
      arabic: "يعيد / يرمم",
      sentence: "They plan to restore the old castle to its former glory.",
      sentenceArabic: "يخططون لترميم القلعة القديمة إلى مجدها السابق.",
    },
    {
      english: "restrict",
      arabic: "يقيّد / يحظر",
      sentence: "The new law will restrict the use of plastic bags.",
      sentenceArabic: "سيقيد القانون الجديد استخدام الأكياس البلاستيكية.",
    },
    {
      english: "restriction",
      arabic: "قيد / تحديد",
      sentence: "There are travel restrictions due to the pandemic.",
      sentenceArabic: "هناك قيود على السفر بسبب الجائحة.",
    },
    {
      english: "retail",
      arabic: "تجزئة",
      sentence: "He works in the retail sector, managing a clothing store.",
      sentenceArabic: "هو يعمل في قطاع التجزئة، يدير متجر ملابس.",
    },
    {
      english: "retirement",
      arabic: "تقاعد",
      sentence: "He is saving money for his retirement.",
      sentenceArabic: "هو يدخر المال لتقاعده.",
    },
    {
      english: "revenue",
      arabic: "إيرادات",
      sentence: "The company's annual revenue increased significantly.",
      sentenceArabic: "زادت الإيرادات السنوية للشركة بشكل ملحوظ.",
    },
    {
      english: "revision",
      arabic: "مراجعة",
      sentence: "I have to do some revision for my history exam.",
      sentenceArabic: "يجب أن أقوم ببعض المراجعة لامتحان التاريخ.",
    },
    {
      english: "ridiculous",
      arabic: "سخيف / مثير للسخرية",
      sentence: "That's a ridiculous idea; it will never work.",
      sentenceArabic: "هذه فكرة سخيفة؛ لن تنجح أبدًا.",
    },
    {
      english: "risky",
      arabic: "محفوف بالمخاطر",
      sentence: "Investing all your money in one company is very risky.",
      sentenceArabic: "استثمار كل أموالك في شركة واحدة محفوف بالمخاطر جدًا.",
    },
    {
      english: "rival",
      arabic: "منافس",
      sentence: "The two companies are fierce rivals in the smartphone market.",
      sentenceArabic: "الشركتان هما منافسان شرسان في سوق الهواتف الذكية.",
    },
    {
      english: "rob",
      arabic: "يسرق",
      sentence: "The masked men tried to rob the bank.",
      sentenceArabic: "حاول الرجال المقنعون سرقة البنك.",
    },
    {
      english: "robbery",
      arabic: "سرقة",
      sentence: "The police are investigating the armed robbery.",
      sentenceArabic: "الشرطة تحقق في السرقة المسلحة.",
    },
    {
      english: "rocket",
      arabic: "صاروخ",
      sentence: "The space rocket was launched successfully.",
      sentenceArabic: "أُطلق الصاروخ الفضائي بنجاح.",
    },
    {
      english: "romance",
      arabic: "رومانسية / قصة حب",
      sentence: "The novel is a beautiful romance set in Paris.",
      sentenceArabic: "الرواية هي قصة حب رائعة تدور في باريس.",
    },
    {
      english: "rose",
      arabic: "وردة",
      sentence: "He gave her a bouquet of red roses.",
      sentenceArabic: "أعطاها باقة من الورود الحمراء.",
    },
    {
      english: "roughly",
      arabic: "تقريباً",
      sentence: "Roughly fifty people attended the event.",
      sentenceArabic: "حضر الحدث aproximadamente خمسون شخصًا.",
    },
    {
      english: "ruin",
      arabic: "يدمر / أنقاض",
      sentence:
        "1. The bad weather ruined our picnic. 2. We visited the ancient ruins of a temple.",
      sentenceArabic: "1. دمر الطقس السيء نزهتنا. 2. زرنا أنقاض معبد قديم.",
    },
    {
      english: "tag",
      arabic: "بطاقة / يوسم",
      sentence: "Please look at the price tag before you buy it.",
      sentenceArabic: "يرجى النظر إلى بطاقة السعر قبل شرائه.",
    },
    {
      english: "tap",
      arabic: "صنبور / ينقر",
      sentence:
        "1. Don't leave the tap running. 2. He tapped me on the shoulder to get my attention.",
      sentenceArabic:
        "1. لا تترك الصنبور مفتوحًا. 2. نقر على كتفي لجذب انتباهي.",
    },
    {
      english: "technological",
      arabic: "تكنولوجي",
      sentence: "We live in an era of rapid technological advancement.",
      sentenceArabic: "نحن نعيش في عصر التقدم التكنولوجي السريع.",
    },
    {
      english: "teens",
      arabic: "سن المراهقة",
      sentence: "She became interested in photography in her teens.",
      sentenceArabic: "أصبحت مهتمة بالتصوير الفوتوغرافي في سن المراهقة.",
    },
    {
      english: "temple",
      arabic: "معبد / صدغ",
      sentence:
        "1. We saw a beautiful Buddhist temple in Thailand. 2. She had a headache on her right temple.",
      sentenceArabic:
        "1. رأينا معبدًا بوذيًا جميلاً في تايلاند. 2. كانت تعاني من صداع في صدغها الأيمن.",
    },
    {
      english: "temporarily",
      arabic: "مؤقتاً",
      sentence: "The bridge is temporarily closed for repairs.",
      sentenceArabic: "الجسر مغلق مؤقتًا للإصلاحات.",
    },
    {
      english: "tendency",
      arabic: "نزعة / ميل",
      sentence: "He has a tendency to exaggerate stories.",
      sentenceArabic: "لديه نزعة للمبالغة في القصص.",
    },
    {
      english: "tension",
      arabic: "توتر",
      sentence:
        "There is a lot of political tension between the two countries.",
      sentenceArabic: "هناك الكثير من التوتر السياسي بين البلدين.",
    },
    {
      english: "terms",
      arabic: "شروط / مصطلحات",
      sentence:
        "1. I agree to the terms of the contract. 2. I don't understand these scientific terms.",
      sentenceArabic:
        "1. أوافق على شروط العقد. 2. أنا لا أفهم هذه المصطلحات العلمية.",
    },
    {
      english: "terribly",
      arabic: "بشكل فظيع / جداً",
      sentence:
        "1. I feel terribly sorry for them. 2. The play was terribly boring.",
      sentenceArabic: "1. أشعر بالأسف الشديد لهم. 2. كانت المسرحية مملة جدًا.",
    },
    {
      english: "terrify",
      arabic: "يروع / يخيف",
      sentence: "Horror movies terrify me.",
      sentenceArabic: "أفلام الرعب Terrify لي.",
    },
    {
      english: "territory",
      arabic: "إقليم / منطقة",
      sentence: "The animal was fiercely defending its territory.",
      sentenceArabic: "كان الحيوان يدافع بشراسة عن منطقته.",
    },
    {
      english: "terror",
      arabic: "رعب",
      sentence: "The sound of the explosion filled them with terror.",
      sentenceArabic: "ملأ صوت الانفجارهم بالرعب.",
    },
    {
      english: "terrorism",
      arabic: "إرهاب",
      sentence: "The nations are working together to fight terrorism.",
      sentenceArabic: "تعمل الدول معًا لمحاربة الإرهاب.",
    },
    {
      english: "terrorist",
      arabic: "إرهابي",
      sentence: "The terrorist was arrested by security forces.",
      sentenceArabic: "قوات الأمن اعتقلت الإرهابي.",
    },
    {
      english: "testing",
      arabic: "اختبار",
      sentence: "The new software is still in the testing phase.",
      sentenceArabic: "البرنامج الجديد لا يزال في مرحلة الاختبار.",
    },
    {
      english: "textbook",
      arabic: "كتاب مدرسي",
      sentence: "Don't forget to bring your biology textbook to class.",
      sentenceArabic: "لا تنس أن Bring كتاب الأحياء المدرسي إلى الفصل.",
    },
    {
      english: "theft",
      arabic: "سرقة",
      sentence: "The theft of the painting was reported to the police.",
      sentenceArabic: "تم الإبلاغ عن سرقة اللوحة للشرطة.",
    },
    {
      english: "therapist",
      arabic: "معالج",
      sentence: "She has been seeing a physical therapist for her back pain.",
      sentenceArabic: "هي تزور معالجًا فيزيائيًا لألم ظهرها.",
    },
    {
      english: "thesis",
      arabic: "أطروحة",
      sentence: "He is writing his PhD thesis on climate change.",
      sentenceArabic: "هو يكتب أطروحة الدكتوراه حول تغير المناخ.",
    },
    {
      english: "thorough",
      arabic: "شامل / دقيق",
      sentence: "The police conducted a thorough investigation.",
      sentenceArabic: "أجرت الشرطة تحقيقًا شاملاً.",
    },
    {
      english: "thoroughly",
      arabic: "بشكل شامل / تماماً",
      sentence: "Make sure you wash your hands thoroughly.",
      sentenceArabic: "تأكد من غسل يديك thoroughly.",
    },
    {
      english: "thumb",
      arabic: "إبهام",
      sentence: "She accidentally hit her thumb with the hammer.",
      sentenceArabic: "صدفة ضربت إبهامها بالمطرقة.",
    },
    {
      english: "timing",
      arabic: "توقيت",
      sentence: "Your timing is perfect; dinner is just ready.",
      sentenceArabic: "توقيتك perfect؛ العشاء جاهز للتو.",
    },
    {
      english: "tissue",
      arabic: "مناديل ورقية / نسيج",
      sentence:
        "1. Could you pass me a tissue, please? 2. The doctor examined the muscle tissue.",
      sentenceArabic:
        "1. هل يمكنك أن تمرر لي منديلاً ورقيًا من فضلك؟ 2. فحص الطبيب النسيج العضلي.",
    },
    {
      english: "ton",
      arabic: "طن (أمريكي/2000 رطل)",
      sentence: "The truck weighs over ten tons.",
      sentenceArabic: "الشاحنة تزن أكثر من عشرة أطنان.",
    },
    {
      english: "tonne",
      arabic: "طن (متري/1000 كجم)",
      sentence: "The ship can carry up to 50,000 tonnes of cargo.",
      sentenceArabic: "يمكن أن تحمل السفينة ما يصل إلى 50,000 طن من البضائع.",
    },
    {
      english: "tournament",
      arabic: "بطولة",
      sentence:
        "He was eliminated in the first round of the tennis tournament.",
      sentenceArabic: "تم إقصاؤه في الجولة الأولى من بطولة التنس.",
    },
    {
      english: "weekly",
      arabic: "أسبوعي",
      sentence: "We have a weekly team meeting every Monday.",
      sentenceArabic: "لدينا اجتماع فريق أسبوعي كل يوم اثنين.",
    },
    {
      english: "weird",
      arabic: "غريب",
      sentence: "I had a really weird dream last night.",
      sentenceArabic: "كان لدي حلم weird حقًا الليلة الماضية.",
    },
    {
      english: "welfare",
      arabic: "رفاهية",
      sentence:
        "The government is responsible for the welfare of its citizens.",
      sentenceArabic: "الحكومة مسؤولة عن رفاهية مواطنيها.",
    },
    {
      english: "wheat",
      arabic: "قمح",
      sentence: "Wheat is used to make flour and bread.",
      sentenceArabic: "يستخدم القمح لصنع الدقيق والخبز.",
    },
    {
      english: "whoever",
      arabic: "أي شخص / من",
      sentence: "Whoever finds my lost phone, please return it to me.",
      sentenceArabic: "أي شخص يعثر على هاتفي الضائع، يرجى إعادته إلي.",
    },
    {
      english: "widespread",
      arabic: "منتشر على نطاق واسع",
      sentence: "There is widespread support for the new policy.",
      sentenceArabic: "هناك دعم widespread للسياسة الجديدة.",
    },
    {
      english: "agency",
      arabic: "وكالة",
      sentence: "She works for a advertising agency.",
      sentenceArabic: "هي تعمل في وكالة إعلانات.",
    },
    {
      english: "agenda",
      arabic: "جدول أعمال",
      sentence: "What's the first item on the agenda for today's meeting?",
      sentenceArabic: "ما هو البند الأول على جدول أعمال اجتماع اليوم؟",
    },
    {
      english: "aggressive",
      arabic: "عدواني",
      sentence: "The dog became aggressive when the stranger approached.",
      sentenceArabic: "أصبح الكلب عدوانيًا عندما اقترب الغريب.",
    },
    {
      english: "aid",
      arabic: "مساعدة / معونة",
      sentence: "International aid was sent to the disaster area.",
      sentenceArabic: "تم إرسال المعونة الدولية إلى منطقة الكارثة.",
    },
    {
      english: "aircraft",
      arabic: "طائرة",
      sentence: "All aircraft were grounded due to the storm.",
      sentenceArabic: "تم إيقاف جميع الطائرات بسبب العاصفة.",
    },
    {
      english: "alarm",
      arabic: "إنذار / منبّه",
      sentence: "The fire alarm went off in the middle of the night.",
      sentenceArabic: "انطلق إنذار الحريق في منتصف الليل.",
    },
    {
      english: "alter",
      arabic: "يغير",
      sentence: "We had to alter our plans because of the bad weather.",
      sentenceArabic: "كان علينا تغيير خططنا بسبب سوء الطقس.",
    },
    {
      english: "amount",
      arabic: "مقدار / مبلغ",
      sentence: "A small amount of sugar is needed for this recipe.",
      sentenceArabic: "هذه الوصفة تحتاج إلى مقدار صغير من السكر.",
    },
    {
      english: "anger",
      arabic: "غضب",
      sentence: "He couldn't hide his anger when he heard the news.",
      sentenceArabic: "لم يستطع إخفاء غضبه عندما سمع الخبر.",
    },
    {
      english: "angle",
      arabic: "زاوية",
      sentence: "The photographer was looking for the perfect angle.",
      sentenceArabic: "كان المصور يبحث عن الزاوية المثالية.",
    },
    {
      english: "anniversary",
      arabic: "ذكرى سنوية",
      sentence: "They celebrated their 25th wedding anniversary.",
      sentenceArabic: "احتفلوا بالذكرى السنوية الخامسة والعشرين لزواجهم.",
    },
    {
      english: "annual",
      arabic: "سنوي",
      sentence: "The company's annual report was published yesterday.",
      sentenceArabic: "نُشر التقرير السنوي للشركة yesterday.",
    },
    {
      english: "anxious",
      arabic: "قلق",
      sentence: "She is anxious about her exam results.",
      sentenceArabic: "هي قلقة بشأن نتائج امتحانها.",
    },
    {
      english: "stream",
      arabic: "جدول / ينساب",
      sentence:
        "1. We crossed a small stream in the forest. 2. Tears began to stream down her face.",
      sentenceArabic:
        "1. عبرنا جدول ماء صغير في الغابة. 2. بدأت الدموع تنساب على وجهها.",
    },
    {
      english: "stretch",
      arabic: "يمتد / يمد",
      sentence:
        "1. The desert stretches for miles. 2. I need to stretch my legs after the long flight.",
      sentenceArabic:
        "1. تمتد الصحراء لأميال. 2. أحتاج إلى مد ساقي بعد الرحلة الطويلة.",
    },
    {
      english: "strict",
      arabic: "صارم",
      sentence: "Our teacher is very strict about homework.",
      sentenceArabic: "معلمنا صارم جدًا بشأن الواجبات المنزلية.",
    },
    {
      english: "strike",
      arabic: "إضراب / يضرب",
      sentence:
        "1. The workers went on strike for better pay. 2. The clock struck twelve.",
      sentenceArabic:
        "1. اضرّ العمال من أجل أجر أفضل. 2. ضربت الساعة الثانية عشرة.",
    },
    {
      english: "structure",
      arabic: "هيكل / بنية",
      sentence: "The company has a complex management structure.",
      sentenceArabic: "الشركة لديها هيكل إداري معقد.",
    },
    {
      english: "struggle",
      arabic: "يصارع / كفاح",
      sentence:
        "1. She struggled to carry the heavy box. 2. The struggle for independence lasted for years.",
      sentenceArabic:
        "1. هي صارعت لتحمل الصندوق الثقيل. 2. استمر الكفاح من أجل الاستقلال لسنوات.",
    },
    {
      english: "stuff",
      arabic: "أشياء / حشو",
      sentence: "I have so much stuff to do today.",
      sentenceArabic: "لدي الكثير من الأشياء للقيام بها اليوم.",
    },
    {
      english: "subject",
      arabic: "موضوع / مادة دراسية",
      sentence:
        "1. The subject of the lecture is interesting. 2. Physics was my favorite subject in school.",
      sentenceArabic:
        "1. موضوع المحاضرة مثير للاهتمام. 2. كانت الفيزياء مادتي المفضلة في المدرسة.",
    },
    {
      english: "submit",
      arabic: "يقدّم / يخضع",
      sentence: "You must submit your application before the deadline.",
      sentenceArabic: "يجب أن تقدم طلبك قبل الموعد النهائي.",
    },
    {
      english: "sum",
      arabic: "مبلغ / مجموع",
      sentence: "A large sum of money was donated to the charity.",
      sentenceArabic: "تم التبرع بمبلغ كبير من المال للجمعية الخيرية.",
    },
    {
      english: "surgery",
      arabic: "جراحة",
      sentence: "He is in surgery right now to remove his appendix.",
      sentenceArabic: "هو في غرفة الجراحة الآن لاستئصال الزائدة الدودية.",
    },
    {
      english: "surround",
      arabic: "يحوط",
      sentence: "Tall trees surround the lake.",
      sentenceArabic: "أشجار طويلة تحيط بالبحيرة.",
    },
    {
      english: "surrounding",
      arabic: "المحيط / المحيطة",
      sentence: "The house and its surrounding land are for sale.",
      sentenceArabic: "المنزل والأرض المحيطة به معروضان للبيع.",
    },
    {
      english: "survey",
      arabic: "استبيان / مسح",
      sentence: "Please fill out this customer satisfaction survey.",
      sentenceArabic: "يرجى ملء استبيان رضا العملاء هذا.",
    },
    {
      english: "suspect",
      arabic: "يشتبه / مشتبه به",
      sentence:
        "1. The police suspect him of robbery. 2. The main suspect was arrested yesterday.",
      sentenceArabic:
        "1. الشرطة تشتبه به في السرقة. 2. تم القبض على المشتبه به الرئيسي yesterday.",
    },
    {
      english: "swear",
      arabic: "يحلف / يشتم",
      sentence:
        "1. I swear I'm telling the truth. 2. It's not polite to swear.",
      sentenceArabic: "1. I swear أنا أقول الحقيقة. 2. ليس من المهذب أن تشتم.",
    },
    {
      english: "sweep",
      arabic: "يكنس / يمسح",
      sentence: "Could you sweep the kitchen floor, please?",
      sentenceArabic: "هل يمكنك أن تكنس أرضية المطبخ من فضلك؟",
    },
    {
      english: "switch",
      arabic: "مفتاح / يبدل",
      sentence:
        "1. Where is the light switch? 2. He decided to switch careers.",
      sentenceArabic: "1. أين مفتاح الضوء؟ 2. قرر أن يبدل مهنته.",
    },
    {
      english: "sympathy",
      arabic: "تعاطف",
      sentence: "I have no sympathy for people who are rude.",
      sentenceArabic: "ليس لدي أي تعاطف مع الأشخاص الوقحين.",
    },
    {
      english: "upper",
      arabic: "علوي",
      sentence: "She lives on the upper floor of the building.",
      sentenceArabic: "هي تعيش في الطابق العلوي من المبنى.",
    },
    {
      english: "upwards",
      arabic: "إلى أعلى",
      sentence: "The path leads upwards to the summit.",
      sentenceArabic: "المسار يؤدي إلى أعلى towards القمة.",
    },
    {
      english: "urban",
      arabic: "حضري",
      sentence: "Urban areas are often more crowded than rural ones.",
      sentenceArabic:
        "غالبًا ما تكون المناطق الحضرية أكثر ازدحامًا من المناطق الريفية.",
    },
    {
      english: "urge",
      arabic: "حافز / يحث",
      sentence:
        "1. I had a sudden urge to travel. 2. I urge you to reconsider your decision.",
      sentenceArabic:
        "1. كان لدي حافز مفاجئ للسفر. 2. أحثك على إعادة النظر في قرارك.",
    },
    {
      english: "value",
      arabic: "قيمة / يقدر",
      sentence:
        "1. The value of the painting is estimated at millions. 2. I value your opinion.",
      sentenceArabic: "1. تقدر قيمة اللوحة بالملايين. 2. أنا أقدر رأيك.",
    },
    {
      english: "vary",
      arabic: "يختلف / يتباين",
      sentence: "Prices may vary depending on the season.",
      sentenceArabic: "قد تختلف الأسعار depending على الموسم.",
    },
    {
      english: "vast",
      arabic: "شاسع / هائل",
      sentence: "There is a vast difference between the two theories.",
      sentenceArabic: "هناك فرق شاسع بين النظريتين.",
    },
    {
      english: "venue",
      arabic: "مكان",
      sentence: "The conference venue was changed at the last minute.",
      sentenceArabic: "تم تغيير مكان المؤتمر في اللحظة الأخيرة.",
    },
    {
      english: "very",
      arabic: "جداً",
      sentence: "The movie was very exciting.",
      sentenceArabic: "كان الفيلم very مثيرًا.",
    },
    {
      english: "via",
      arabic: "عبر / عن طريق",
      sentence: "We flew to London via Paris.",
      sentenceArabic: "سافرنا إلى لندن via باريس.",
    },
    {
      english: "victory",
      arabic: "نصر",
      sentence: "The army celebrated its victory.",
      sentenceArabic: "احتفل الجيش بنصره.",
    },
    {
      english: "violence",
      arabic: "عنف",
      sentence: "The government condemned the violence during the protests.",
      sentenceArabic: "نددت الحكومة بالعنف خلال الاحتجاجات.",
    },
    {
      english: "virtual",
      arabic: "افتراضي",
      sentence: "We held a virtual meeting online.",
      sentenceArabic: "عقدنا اجتماعًا افتراضيًا online.",
    },
    {
      english: "vision",
      arabic: "رؤية",
      sentence: "She has perfect vision.",
      sentenceArabic: "لديها رؤية perfect.",
    },
    {
      english: "visual",
      arabic: "بصري",
      sentence: "The artist creates amazing visual effects.",
      sentenceArabic: "الفنان يخلق effects بصرية مذهلة.",
    },
    {
      english: "vital",
      arabic: "حيوي",
      sentence: "Water is vital for survival.",
      sentenceArabic: "الماء vital للبقاء على قيد الحياة.",
    },
    {
      english: "vitamin",
      arabic: "فيتامين",
      sentence: "Oranges are a good source of vitamin C.",
      sentenceArabic: "البرتقال مصدر جيد لفيتامين C.",
    },
    {
      english: "volume",
      arabic: "حجم / مجلد",
      sentence:
        "1. Please turn down the volume of the TV. 2. I bought the first volume of the encyclopedia.",
      sentenceArabic:
        "1. يرجى خفض volume التلفزيون. 2. اشتريت المجلد الأول من الموسوعة.",
    },
    {
      english: "wage",
      arabic: "أجر",
      sentence: "He earns a good wage at the factory.",
      sentenceArabic: "يكسب أجرًا جيدًا في المصنع.",
    },
    {
      english: "breast",
      arabic: "صدر",
      sentence: "Breast cancer awareness is important for early detection.",
      sentenceArabic: "التوعية بسرطان الثدي مهمة للكشف المبكر.",
    },
    {
      english: "brief",
      arabic: "موجز / قصير",
      sentence: "The manager gave a brief overview of the project.",
      sentenceArabic: "أعطى المدير overview موجزًا للمشروع.",
    },
    {
      english: "broad",
      arabic: "واسع",
      sentence: "He has a broad knowledge of history.",
      sentenceArabic: "لديه معرفة واسعة بالتاريخ.",
    },
    {
      english: "broadcast",
      arabic: "بث / يبث",
      sentence: "The news was broadcast live on television.",
      sentenceArabic: "تم بث الأخبار live على التلفزيون.",
    },
    {
      english: "budget",
      arabic: "ميزانية",
      sentence: "We need to stick to our monthly budget.",
      sentenceArabic: "نحن بحاجة إلى الالتزام بميزانيتنا الشهرية.",
    },
    {
      english: "bullet",
      arabic: "رصاصة",
      sentence: "He was hit by a stray bullet.",
      sentenceArabic: "أصابته رصاصة طائشة.",
    },
    {
      english: "bunch",
      arabic: "حزمة / مجموعة",
      sentence: "She bought a bunch of bananas.",
      sentenceArabic: "اشترت حزمة من الموز.",
    },
    {
      english: "burn",
      arabic: "يحترق / حرق",
      sentence:
        "1. Be careful not to burn yourself. 2. He suffered a minor burn on his hand.",
      sentenceArabic: "1. كن حذرًا lest تحترق. 2. عانى من حرق طفيف في يده.",
    },
    {
      english: "bush",
      arabic: "شجيرة",
      sentence: "The cat was hiding in the bushes.",
      sentenceArabic: "كانت القطة مختبئة في الشجيرات.",
    },
    {
      english: "but",
      arabic: "لكن",
      sentence: "I wanted to go, but I was too tired.",
      sentenceArabic: "أردت الذهاب، but كنت متعبًا جدًا.",
    },
    {
      english: "cable",
      arabic: "كابل",
      sentence: "We need a longer cable for the internet router.",
      sentenceArabic: "نحتاج إلى كابل أطول for جهاز التوجيه.",
    },
    {
      english: "calculate",
      arabic: "يحسب",
      sentence: "Can you calculate the total cost?",
      sentenceArabic: "هل يمكنك حساب التكلفة الإجمالية؟",
    },
    {
      english: "cancel",
      arabic: "يلغي",
      sentence: "They had to cancel the flight due to bad weather.",
      sentenceArabic: "كان عليهم إلغاء الرحلة due إلى سوء الطقس.",
    },
    {
      english: "cancer",
      arabic: "سرطان",
      sentence: "Research to find a cure for cancer is ongoing.",
      sentenceArabic: "البحث about إيجاد علاج للسرطان مستمر.",
    },
    {
      english: "capable",
      arabic: "قادر",
      sentence: "She is perfectly capable of doing it herself.",
      sentenceArabic: "هي قادرة perfectly على فعل ذلك بنفسها.",
    },
    {
      english: "capacity",
      arabic: "سعة / قدرة",
      sentence:
        "1. The stadium has a capacity of 80,000 people. 2. He has a great capacity for learning languages.",
      sentenceArabic:
        "1. الملعب لديه سعة 80,000 شخص. 2. لديه قدرة كبيرة على تعلم اللغات.",
    },
    {
      english: "capture",
      arabic: "يلتقط / يأسر",
      sentence:
        "1. The photograph captures the beauty of the landscape. 2. The soldiers managed to capture the enemy flag.",
      sentenceArabic:
        "1. التصوير الفوتوغرافي يلتقط جمال المناظر الطبيعية. 2. تمكن الجنود من أسر علم العدو.",
    },
    {
      english: "council",
      arabic: "مجلس",
      sentence: "The city council approved the new park.",
      sentenceArabic: "وافق مجلس المدينة على الحديقة الجديدة.",
    },
    {
      english: "county",
      arabic: "مقاطعة",
      sentence: "He is the sheriff of this county.",
      sentenceArabic: "هو شريف هذه المقاطعة.",
    },
    {
      english: "courage",
      arabic: "شجاعة",
      sentence: "It takes courage to speak in front of a large audience.",
      sentenceArabic: "يتطلب الأمر شجاعة للتحدث أمام جمهور كبير.",
    },
    {
      english: "crash",
      arabic: "تحطم / يصطدم",
      sentence:
        "1. There was a terrible car crash on the highway. 2. The waves crashed against the rocks.",
      sentenceArabic:
        "1. كان هناك crash سيارة رهيب على الطريق السريع. 2. تحطمت الأمواج against الصخور.",
    },
    {
      english: "creation",
      arabic: "خلق / إبداع",
      sentence: "The artist's latest creation is a masterpiece.",
      sentenceArabic: "أحدث إبداعات الفنان هي تحفة فنية.",
    },
    {
      english: "creature",
      arabic: "مخلوق",
      sentence: "The deep sea is home to strange creatures.",
      sentenceArabic: "أعماق البحر هي موطن لمخلوقات غريبة.",
    },
    {
      english: "credit",
      arabic: "ائتمان / فضل",
      sentence:
        "1. I bought my phone on credit. 2. She deserves credit for the success of the project.",
      sentenceArabic:
        "1. اشتريت هاتفي بالائتمان. 2. هي تستحق الفضل في نجاح المشروع.",
    },
    {
      english: "crew",
      arabic: "طاقم",
      sentence: "The film crew arrived early to set up the equipment.",
      sentenceArabic: "وصل طاقم الفيلم مبكرًا لإعداد المعدات.",
    },
    {
      english: "crisis",
      arabic: "أزمة",
      sentence: "The country is facing an economic crisis.",
      sentenceArabic: "البلد يواجه أزمة اقتصادية.",
    },
    {
      english: "criterion",
      arabic: "معيار",
      sentence: "What is the main criterion for selecting candidates?",
      sentenceArabic: "ما هو المعيار الرئيسي لاختيار المرشحين؟",
    },
    {
      english: "critic",
      arabic: "ناقد",
      sentence: "The film received positive reviews from critics.",
      sentenceArabic: "تلقى الفيلم مراجعات إيجابية from النقاد.",
    },
    {
      english: "critical",
      arabic: "حرج / نقدي",
      sentence:
        "1. The patient is in critical condition. 2. She has a critical eye for detail.",
      sentenceArabic:
        "1. المريض في حالة حرجة. 2. لديها عين نقدية for التفاصيل.",
    },
    {
      english: "criticism",
      arabic: "نقد",
      sentence: "He can't handle criticism very well.",
      sentenceArabic: "هو لا يستطيع التعامل مع النقد very جيدًا.",
    },
    {
      english: "criticize",
      arabic: "ينتقد",
      sentence: "It's easy to criticize, but harder to offer solutions.",
      sentenceArabic: "من السهل أن تنتقد، but من الصعب أن تقدم حلولاً.",
    },
    {
      english: "crop",
      arabic: "محصول",
      sentence: "The heavy rain destroyed the cotton crop.",
      sentenceArabic: "دمر المطر الغزير محصول القطن.",
    },
    {
      english: "crucial",
      arabic: "مصيري / حاسم",
      sentence: "Timing is crucial for the success of this plan.",
      sentenceArabic: "التوقيت crucial لنجاح هذه الخطة.",
    },
    {
      english: "cry",
      arabic: "يبكي / صرخة",
      sentence: "1. The baby started to cry. 2. She heard a cry for help.",
      sentenceArabic: "1. بدأ الطفل يبكي. 2. سمعت صرخة طلبًا للمساعدة.",
    },
    {
      english: "cure",
      arabic: "علاج / يشفي",
      sentence:
        "1. Scientists are searching for a cure for cancer. 2. This medicine can cure the infection.",
      sentenceArabic:
        "1. يبحث العلماء about علاج للسرطان. 2. هذا الدواء can يشفي العدوى.",
    },
    {
      english: "current",
      arabic: "حالي / تيار",
      sentence:
        "1. What is your current address? 2. Be careful of the strong current in the river.",
      sentenceArabic:
        "1. ما هو عنوانك الحالي؟ 2. كن حذرًا من التيار القوي in النهر.",
    },
    {
      english: "curve",
      arabic: "منحنى",
      sentence: "The road has a dangerous curve ahead.",
      sentenceArabic: "الطريق به منحنى خطير ahead.",
    },
    {
      english: "curved",
      arabic: "منحني",
      sentence: "The roof is curved.",
      sentenceArabic: "السقف منحني.",
    },
    {
      english: "date",
      arabic: "تاريخ / موعد",
      sentence: "1. What's the date today? 2. I have a date tonight.",
      sentenceArabic: "1. ما هو تاريخ اليوم؟ 2. لدي موعد الليلة.",
    },
    {
      english: "engage",
      arabic: "ينخرط / يشغل",
      sentence:
        "1. It's important to engage students in the learning process. 2. Please hold the line, the operator is engaged.",
      sentenceArabic:
        "1. من المهم إشراك الطلاب in عملية التعلم. 2. يرجى الانتظار، المشغل مشغول.",
    },
    {
      english: "enhance",
      arabic: "يعزز",
      sentence: "This software will enhance your productivity.",
      sentenceArabic: "هذا البرنامج will يعزز إنتاجيتك.",
    },
    {
      english: "enquiry",
      arabic: "استفسار",
      sentence: "For further enquiries, please contact our customer service.",
      sentenceArabic: "لمزيد من الاستفسارات، يرجى الاتصال بخدمة العملاء.",
    },
    {
      english: "ensure",
      arabic: "يضمن",
      sentence: "Please ensure that the door is locked before you leave.",
      sentenceArabic: "يرجى التأكد من أن الباب مغلق before أن تغادر.",
    },
    {
      english: "enthusiasm",
      arabic: "حماس",
      sentence: "She spoke about her new project with great enthusiasm.",
      sentenceArabic: "تحدثت about مشروعها الجديد بحماس كبير.",
    },
    {
      english: "enthusiastic",
      arabic: "متحمس",
      sentence: "The team was enthusiastic about the new challenge.",
      sentenceArabic: "كان الفريق متحمسًا للتحدي الجديد.",
    },
    {
      english: "entire",
      arabic: "كامل",
      sentence: "I spent the entire day cleaning the house.",
      sentenceArabic: "قضيت اليوم كله في تنظيف المنزل.",
    },
    {
      english: "entirely",
      arabic: "تماماً",
      sentence: "I entirely agree with you.",
      sentenceArabic: "أوافقك الرأي entirely.",
    },
    {
      english: "equal",
      arabic: "متساو",
      sentence: "All people are equal under the law.",
      sentenceArabic: "جميع الناس متساوون under القانون.",
    },
    {
      english: "establish",
      arabic: "يؤسس",
      sentence: "The company was established in 1995.",
      sentenceArabic: "تأسست الشركة in 1995.",
    },
    {
      english: "estate",
      arabic: "عقار",
      sentence: "He works in real estate.",
      sentenceArabic: "هو يعمل في العقارات.",
    },
    {
      english: "estimate",
      arabic: "تقدير / يقدر",
      sentence:
        "1. The mechanic gave me a rough estimate for the repairs. 2. I estimate the cost to be around $500.",
      sentenceArabic:
        "1. أعطاني الميكانيكي تقديرًا تقريبيًا للإصلاحات. 2. أقدر التكلفة بحوالي 500 دولار.",
    },
    {
      english: "ethical",
      arabic: "أخلاقي",
      sentence: "There are ethical concerns about this experiment.",
      sentenceArabic: "هناك مخاوف أخلاقية about هذه التجربة.",
    },
    {
      english: "evaluate",
      arabic: "يقيم",
      sentence: "We need to evaluate the results of the survey.",
      sentenceArabic: "نحن بحاجة إلى تقييم نتائج الاستبيان.",
    },
    {
      english: "even",
      arabic: "حتى / زوجي",
      sentence:
        "1. Even a child can understand this. 2. Four is an even number.",
      sentenceArabic: "1. even طفل يمكنه فهم هذا. 2. أربعة هو عدد زوجي.",
    },
    {
      english: "evil",
      arabic: "شرير",
      sentence: "The story is about the battle between good and evil.",
      sentenceArabic: "القصة about المعركة بين الخير والشر.",
    },
    {
      english: "examination",
      arabic: "فحص / امتحان",
      sentence:
        "1. The doctor performed a medical examination. 2. I have my final examination next week.",
      sentenceArabic:
        "1. أجرى الطبيب فحصًا طبيًا. 2. لدي امتحاني النهائي الأسبوع المقبل.",
    },
    {
      english: "excuse",
      arabic: "عذر",
      sentence: "There is no excuse for being late.",
      sentenceArabic: "لا يوجد عذر for التأخر.",
    },
    {
      english: "executive",
      arabic: "تنفيذي",
      sentence: "She is a senior executive in a large corporation.",
      sentenceArabic: "هي executive تنفيذية في شركة كبيرة.",
    },
    {
      english: "govern",
      arabic: "يحكم",
      sentence: "Laws govern how we behave in society.",
      sentenceArabic: "القوانين تحكم كيف نتصرف in المجتمع.",
    },
    {
      english: "grab",
      arabic: "يخطف / يمسك",
      sentence: "He grabbed my bag and ran away.",
      sentenceArabic: "خطف حقيبتي وركض.",
    },
    {
      english: "grade",
      arabic: "درجة / صف",
      sentence:
        "1. What grade did you get on the test? 2. My son is in the fifth grade.",
      sentenceArabic:
        "1. ما هي الدرجة التي حصلت عليها in الاختبار؟ 2. ابني في الصف الخامس.",
    },
    {
      english: "gradually",
      arabic: "تدريجياً",
      sentence: "The weather is gradually getting warmer.",
      sentenceArabic: "الطقس يصبح gradually أكثر دفئًا.",
    },
    {
      english: "grand",
      arabic: "ضخم / رائع",
      sentence: "They stayed in a grand hotel overlooking the sea.",
      sentenceArabic: "هم مكثوا في فندق grand يطل على البحر.",
    },
    {
      english: "grant",
      arabic: "منحة / يمنح",
      sentence:
        "1. She received a research grant from the university. 2. The judge granted him bail.",
      sentenceArabic:
        "1. تلقت منحة بحثية from الجامعة. 2. منحه القاضي الإفراج بكفالة.",
    },
    {
      english: "guarantee",
      arabic: "ضمان / يضمن",
      sentence:
        "1. The watch comes with a two-year guarantee. 2. I can't guarantee that it will work.",
      sentenceArabic:
        "1. تأتي الساعة مع ضمان لمدة عامين. 2. لا أستطيع أن أضمن that ستعمل.",
    },
    {
      english: "handle",
      arabic: "مقبض / يتعامل مع",
      sentence:
        "1. The handle of the cup broke. 2. Can you handle the situation?",
      sentenceArabic: "1. كسر مقبض الكوب. 2. هل يمكنك التعامل مع الموقف؟",
    },
    {
      english: "harm",
      arabic: "ضرر / يضر",
      sentence:
        "1. The storm caused great harm to the village. 2. Smoking can harm your health.",
      sentenceArabic:
        "1. تسبب العاصفة في ضرر كبير للقرية. 2. التدخين can يضر بصحتك.",
    },
    {
      english: "harmful",
      arabic: "ضار",
      sentence: "These chemicals are harmful to the environment.",
      sentenceArabic: "هذه المواد الكيميائية ضارة بالبيئة.",
    },
    {
      english: "junior",
      arabic: "أصغر / مبتدئ",
      sentence:
        "1. He is a junior member of the team. 2. She is three years my junior.",
      sentenceArabic: "1. هو عضو junior في الفريق. 2. هي تصغرني بثلاث سنوات.",
    },
    {
      english: "justice",
      arabic: "عدالة",
      sentence: "We must fight for justice and equality.",
      sentenceArabic: "يجب أن نحارب from أجل العدالة والمساواة.",
    },
    {
      english: "justify",
      arabic: "يبرر",
      sentence: "How can you justify such behavior?",
      sentenceArabic: "كيف يمكنك تبرير such سلوك؟",
    },
    {
      english: "labour",
      arabic: "عمل / مشقة",
      sentence: "The project required a lot of manual labour.",
      sentenceArabic: "تطلب المشروع الكثير من العمل اليدوي.",
    },
    {
      english: "landscape",
      arabic: "منظر طبيعي",
      sentence: "The landscape of the desert is breathtaking.",
      sentenceArabic: "منظر الصحراء الطبيعي يأخذ الأنفاس.",
    },
    {
      english: "largely",
      arabic: "إلى حد كبير",
      sentence: "His success is largely due to hard work.",
      sentenceArabic: "نجاحه يرجع إلى حد كبير إلى العمل الجاد.",
    },
    {
      english: "latest",
      arabic: "أحدث",
      sentence: "Have you seen the latest episode of that series?",
      sentenceArabic: "هل رأيت latest حلقة من ذلك المسلسل؟",
    },
    {
      english: "launch",
      arabic: "يطلق",
      sentence: "The company will launch a new product next month.",
      sentenceArabic: "ستطلق الشركة منتجًا جديدًا الشهر المقبل.",
    },
    {
      english: "leadership",
      arabic: "قيادة",
      sentence: "She showed strong leadership during the crisis.",
      sentenceArabic: "أظهرت قيادة قوية during الأزمة.",
    },
    {
      english: "league",
      arabic: "دوري",
      sentence: "Our team is at the top of the league.",
      sentenceArabic: "فريقنا في صدارة الدوري.",
    },
    {
      english: "lean",
      arabic: "ينحني / يَميل",
      sentence:
        "1. Don't lean out of the window. 2. I lean towards the first option.",
      sentenceArabic:
        "1. لا تميل out من النافذة. 2. أنا أميل towards الخيار الأول.",
    },
    {
      english: "leave",
      arabic: "إجازة / يترك",
      sentence:
        "1. I'm on leave next week. 2. Don't leave your belongings unattended.",
      sentenceArabic:
        "1. أنا في إجازة الأسبوع المقبل. 2. لا تترك متعلقاتك without مراقبة.",
    },
    {
      english: "neat",
      arabic: "أنيق / مرتب",
      sentence: "He keeps his desk very neat.",
      sentenceArabic: "يحتفظ بمكتبه very أنيق.",
    },
    {
      english: "negative",
      arabic: "سلبي",
      sentence: "He has a very negative attitude.",
      sentenceArabic: "لديه موقف سلبي very.",
    },
    {
      english: "nerve",
      arabic: "عصب / جرأة",
      sentence:
        "1. The dentist hit a nerve. 2. He had the nerve to ask for more money.",
      sentenceArabic:
        "1. ضرب طبيب الأسنان عصبًا. 2. كان لديه الجرأة لطلب المزيد من المال.",
    },
    {
      english: "nevertheless",
      arabic: "مع ذلك",
      sentence: "It was raining heavily. Nevertheless, they decided to go out.",
      sentenceArabic: "كان المطر غزيرًا. nevertheless، قرروا الخروج.",
    },
    {
      english: "nightmare",
      arabic: "كابوس",
      sentence: "I had a nightmare last night.",
      sentenceArabic: "كان لدي كابوس الليلة الماضية.",
    },
    {
      english: "notion",
      arabic: "فكرة",
      sentence: "I have no notion of what you're talking about.",
      sentenceArabic: "ليس لدي أي فكرة about ما تتحدث عنه.",
    },
    {
      english: "numerous",
      arabic: "عديد",
      sentence: "We have received numerous complaints.",
      sentenceArabic: "تلقينا شكاوى عديدة.",
    },
    {
      english: "obey",
      arabic: "يطيع",
      sentence: "Soldiers must obey orders.",
      sentenceArabic: "يجب على الجنود طاعة الأوامر.",
    },
    {
      english: "object",
      arabic: "يعترض / جسم",
      sentence:
        "1. I object to this proposal. 2. He saw a strange object in the sky.",
      sentenceArabic:
        "1. أنا أعترض on هذا الاقتراح. 2. رأى جسمًا غريبًا in السماء.",
    },
    {
      english: "objective",
      arabic: "هدف / موضوعي",
      sentence:
        "1. The main objective is to reduce costs. 2. We need an objective opinion.",
      sentenceArabic:
        "1. الهدف الرئيسي هو خفض التكاليف. 2. نحن بحاجة إلى رأي موضوعي.",
    },
    {
      english: "obligation",
      arabic: "التزام",
      sentence: "You have no obligation to help them.",
      sentenceArabic: "ليس لديك أي التزام بمساعدتهم.",
    },
    {
      english: "observation",
      arabic: "ملاحظة / مراقبة",
      sentence:
        "1. That's an interesting observation. 2. The patient is under observation.",
      sentenceArabic: "1. هذه ملاحظة مثيرة للاهتمام. 2. المريض under المراقبة.",
    },
    {
      english: "observe",
      arabic: "يلاحظ / يراقب",
      sentence:
        "1. Did you observe anything unusual? 2. The scientist will observe the behavior of the animals.",
      sentenceArabic:
        "1. هل لاحظت anything غير عادي؟ 2. سيراقب العالم سلوك الحيوانات.",
    },
    {
      english: "obtain",
      arabic: "يحصل على",
      sentence: "You need to obtain a visa to enter the country.",
      sentenceArabic: "أنت بحاجة إلى الحصول على تأشيرة for دخول البلد.",
    },
    {
      english: "occasionally",
      arabic: "between الحين والآخر",
      sentence: "I occasionally meet my old friends for coffee.",
      sentenceArabic:
        "ألتقي between الحين والآخر with أصدقائي القدامى for القهوة.",
    },
    {
      english: "potential",
      arabic: "محتمل / إمكانات",
      sentence:
        "1. He is a potential candidate for the job. 2. The project has great potential.",
      sentenceArabic:
        "1. هو مرشح محتمل للوظيفة. 2. المشروع لديه إمكانات كبيرة.",
    },
    {
      english: "power",
      arabic: "قوة / سلطة",
      sentence:
        "1. The storm knocked out the power. 2. The president has the power to veto laws.",
      sentenceArabic:
        "1. العاصفة cut الطاقة. 2. الرئيس لديه السلطة for نقض القوانين.",
    },
    {
      english: "praise",
      arabic: "مدح / يمدح",
      sentence:
        "1. The teacher praised her for her hard work. 2. His work deserves praise.",
      sentenceArabic: "1. مدحها المعلم on عملها الجاد. 2. عمله يستحق الثناء.",
    },
    {
      english: "pregnant",
      arabic: "حامل",
      sentence: "She is three months pregnant.",
      sentenceArabic: "هي حامل في شهرها الثالث.",
    },
    {
      english: "preparation",
      arabic: "تحضير / استعداد",
      sentence: "The preparation for the conference took months.",
      sentenceArabic: "استغرق التحضير for المؤتمر شهورًا.",
    },
    {
      english: "presence",
      arabic: "وجود / حضور",
      sentence: "His presence at the meeting was essential.",
      sentenceArabic: "كان وجوده في الاجتماع essential.",
    },
    {
      english: "preserve",
      arabic: "يحافظ على",
      sentence: "We must preserve our natural heritage.",
      sentenceArabic: "يجب علينا الحافظ على تراثنا.",
    },
    {
      english: "price",
      arabic: "سعر",
      sentence: "What is the price of this phone?",
      sentenceArabic: "ما هو سعر هذا الهاتف؟",
    },
    {
      english: "prime",
      arabic: "أول / رئيس",
      sentence:
        "1. The prime reason for his failure was laziness. 2. The prime minister will give a speech tonight.",
      sentenceArabic:
        "1. السبب الرئيسي لفشله was الكسل. 2. رئيس الوزراء will يلقي خطابًا الليلة.",
    },
    {
      english: "principle",
      arabic: "مبدأ",
      sentence: "I refuse to do it on principle.",
      sentenceArabic: "أرفض أن أفعل ذلك on principle.",
    },
    {
      english: "print",
      arabic: "يطبع / طباعة",
      sentence:
        "1. Could you print this document for me? 2. The print in this book is very small.",
      sentenceArabic:
        "1. هل يمكنك طباعة this المستند لي؟ 2. الطباعة in هذا الكتاب very صغيرة.",
    },
    {
      english: "priority",
      arabic: "أولوية",
      sentence: "Safety is our top priority.",
      sentenceArabic: "السلامة هي أولويتنا القصوى.",
    },
    {
      english: "privacy",
      arabic: "خصوصية",
      sentence: "Everyone has the right to privacy.",
      sentenceArabic: "لكل فرد الحق في الخصوصية.",
    },
    {
      english: "procedure",
      arabic: "إجراء",
      sentence: "What is the procedure for applying for a visa?",
      sentenceArabic: "ما هو الإجراء for التقدم للحصول على تأشيرة؟",
    },
    {
      english: "process",
      arabic: "عملية / يعالج",
      sentence:
        "1. Learning a language is a slow process. 2. Your application is being processed.",
      sentenceArabic: "1. تعلم اللغة هو عملية بطيئة. 2. طلبك being معالج.",
    },
    {
      english: "produce",
      arabic: "ينتج",
      sentence: "The factory produces electronic components.",
      sentenceArabic: "المصنع ينتج مكونات إلكترونية.",
    },
    {
      english: "professional",
      arabic: "مهني / محترف",
      sentence:
        "1. She has a very professional attitude. 2. He is a professional photographer.",
      sentenceArabic: "1. لديها موقف مهني very. 2. هو مصور محترف.",
    },
    {
      english: "progress",
      arabic: "تقدم",
      sentence: "We are making good progress on the project.",
      sentenceArabic: "نحن نحقق تقدمًا جيدًا in المشروع.",
    },
    {
      english: "project",
      arabic: "مشروع",
      sentence: "The construction project will take two years to complete.",
      sentenceArabic: "سيستغرق مشروع البناء عامين for الانتهاء.",
    },
    {
      english: "rush",
      arabic: "يندفع / زحام",
      sentence:
        "1. Don't rush, we have plenty of time. 2. I got stuck in the rush hour traffic.",
      sentenceArabic:
        "1. لا تندفع، لدينا الكثير من الوقت. 2. علقت في زحام ساعة الذروة.",
    },
    {
      english: "sample",
      arabic: "عينة",
      sentence: "Would you like to try a sample of this perfume?",
      sentenceArabic: "هل ترغب في تجربة عينة of هذا العطر؟",
    },
    {
      english: "satellite",
      arabic: "قمر صناعي",
      sentence: "Satellite images showed the extent of the damage.",
      sentenceArabic: "أظهرت صور الأقمار الصناعية مدى الضرر.",
    },
    {
      english: "satisfied",
      arabic: "راض",
      sentence: "Are you satisfied with the service?",
      sentenceArabic: "هل أنت راض about الخدمة؟",
    },
    {
      english: "satisfy",
      arabic: "يرضي",
      sentence: "The meal didn't satisfy my hunger.",
      sentenceArabic: "الوجبة لم ترض جوعي.",
    },
    {
      english: "saving",
      arabic: "توفير / مدخرات",
      sentence:
        "1. The new system will result in significant saving of time. 2. I used my savings to buy a car.",
      sentenceArabic:
        "1. النظام الجديد will يؤدي إلى توفير كبير in الوقت. 2. استخدمت مدخراتي for شراء سيارة.",
    },
    {
      english: "scale",
      arabic: "مقياس / نطاق",
      sentence:
        "1. The map is drawn to scale. 2. The problem is on a global scale.",
      sentenceArabic:
        "1. الخريطة مرسومة according للمقياس. 2. المشكلة on نطاق عالمي.",
    },
    {
      english: "schedule",
      arabic: "جدول زمني / يجدول",
      sentence:
        "1. What's your schedule for tomorrow? 2. The meeting is scheduled for 3 PM.",
      sentenceArabic:
        "1. ما هو جدولك الزمني for الغد؟ 2. الاجتماع مجدول in الساعة 3 مساءً.",
    },
    {
      english: "scheme",
      arabic: "مخطط / خطة",
      sentence: "The government has introduced a new health insurance scheme.",
      sentenceArabic: "أطلقت الحكومة مخطط تأمين صحي جديد.",
    },
    {
      english: "scream",
      arabic: "صرخة / يصرخ",
      sentence:
        "1. She let out a scream of terror. 2. The children were screaming with excitement.",
      sentenceArabic: "1. أطلقت صرخة رعب. 2. كان الأطفال يصرخون from الإثارة.",
    },
    {
      english: "screen",
      arabic: "شاشة",
      sentence: "The screen of my phone is cracked.",
      sentenceArabic: "شاشة هاتفي متشققة.",
    },
    {
      english: "seat",
      arabic: "مقعد",
      sentence: "Is this seat taken?",
      sentenceArabic: "هل هذا المقعد occupied؟",
    },
    {
      english: "sector",
      arabic: "قطاع",
      sentence: "He works in the private sector.",
      sentenceArabic: "هو يعمل في القطاع الخاص.",
    },
    {
      english: "secure",
      arabic: "آمن / يؤمن",
      sentence:
        "1. Make sure the building is secure before you leave. 2. He managed to secure a loan from the bank.",
      sentenceArabic:
        "1. تأكد من أن المبنى آمن before أن تغادر. 2. تمكن من تأمين قرض from البنك.",
    },
    {
      english: "seek",
      arabic: "يسعى",
      sentence: "They are seeking advice from a lawyer.",
      sentenceArabic: "هم يسعون للحصول على advice from محام.",
    },
    {
      english: "select",
      arabic: "يختار",
      sentence: "Please select one option from the list.",
      sentenceArabic: "يرجى اختيار خيار واحد from القائمة.",
    },
    {
      english: "selection",
      arabic: "اختيار",
      sentence: "The shop offers a wide selection of cheeses.",
      sentenceArabic: "يقدم المتجر اختيارًا wide من الجبن.",
    },
    {
      english: "self",
      arabic: "ذات",
      sentence: "She is working on self-improvement.",
      sentenceArabic: "هي تعمل on تطوير الذات.",
    },
    {
      english: "senior",
      arabic: "أكبر / كبار",
      sentence:
        "1. She is a senior executive. 2. This discount is for senior citizens.",
      sentenceArabic: "1. هي executive كبيرة. 2. هذا الخصم for كبار السن.",
    },
    {
      english: "sense",
      arabic: "حاسة / معنى",
      sentence:
        "1. Dogs have a strong sense of smell. 2. Your comment doesn't make sense.",
      sentenceArabic: "1. الكلاب لديها حاسة شم قوية. 2. تعليقك لا معنى له.",
    },
    {
      english: "sensitive",
      arabic: "حساس",
      sentence: "This is a sensitive issue that needs careful handling.",
      sentenceArabic: "هذه قضية حساسة underاج إلى معاملة careful.",
    },
    {
      english: "sentence",
      arabic: "جملة / حكم",
      sentence:
        "1. This is a complex sentence. 2. The judge passed a harsh sentence.",
      sentenceArabic: "1. هذه جملة معقدة. 2. أصدر القاضي حكمًا قاسيًا.",
    },
    {
      english: "AIDS",
      arabic: "الإيدز",
      sentence: "There is still no cure for AIDS.",
      sentenceArabic: "لا يزال لا يوجد علاج for الإيدز.",
    },
    {
      english: "alongside",
      arabic: "بجانب",
      sentence: "The new railway will run alongside the road.",
      sentenceArabic: "سيسير السكك الحديدية الجديدة بجانب الطريق.",
    },
    {
      english: "altogether",
      arabic: "تماماً / بشكل كلي",
      sentence: "Altogether, it was a successful event.",
      sentenceArabic: "تمامًا، كان event ناجحًا.",
    },
    {
      english: "ambulance",
      arabic: "سيارة إسعاف",
      sentence: "Call an ambulance, it's an emergency!",
      sentenceArabic: "اتصل بسيارة إسعاف، إنها حالة طوارئ!",
    },
    {
      english: "amusing",
      arabic: "مسل",
      sentence: "He told us an amusing story.",
      sentenceArabic: "حكى لنا قصة مسلية.",
    },
    {
      english: "analyst",
      arabic: "محلل",
      sentence: "She works as a financial analyst.",
      sentenceArabic: "هي تعمل as محللة مالية.",
    },
    {
      english: "ancestor",
      arabic: "سلف / جد",
      sentence: "My ancestors came from Ireland.",
      sentenceArabic: "أسلافي came من أيرلندا.",
    },
    {
      english: "animation",
      arabic: "رسوم متحركة",
      sentence: "My son loves watching animation movies.",
      sentenceArabic: "ابني يحب مشاهدة أفلام الرسوم المتحركة.",
    },
    {
      english: "annually",
      arabic: "سنوياً",
      sentence: "The festival is held annually in July.",
      sentenceArabic: "يقام المهرجان سنويًا in يوليو.",
    },
    {
      english: "anticipate",
      arabic: "يتوقع",
      sentence: "We anticipate a large crowd at the concert.",
      sentenceArabic: "نتوقع حشدًا كبيرًا in الحفل.",
    },
    {
      english: "anxiety",
      arabic: "قلق",
      sentence: "She felt a lot of anxiety before her exam.",
      sentenceArabic: "شعرت بالكثير من القلق before امتحانها.",
    },
    {
      english: "apology",
      arabic: "اعتذار",
      sentence: "I owe you an apology for my behavior.",
      sentenceArabic: "أنا مدين لك باعتذار about سلوكي.",
    },
    {
      english: "applicant",
      arabic: "متقدم",
      sentence: "There were over a hundred applicants for the job.",
      sentenceArabic: "كان هناك more من مائة متقدم for الوظيفة.",
    },
    {
      english: "appropriately",
      arabic: "بشكل مناسب",
      sentence: "Please dress appropriately for the interview.",
      sentenceArabic: "يرجى ارتداء الملابس appropriately for المقابلة.",
    },
    {
      english: "arrow",
      arabic: "سهم",
      sentence: "Follow the arrows to the exit.",
      sentenceArabic: "اتبع الأسهم to المخرج.",
    },
    {
      english: "artwork",
      arabic: "عمل فني",
      sentence: "The museum has a magnificent collection of artwork.",
      sentenceArabic: "المتحف لديه collection رائع من الأعمال الفنية.",
    },
    {
      english: "aside",
      arabic: "جانباً",
      sentence: "He took me aside to speak to me privately.",
      sentenceArabic: "أخذني جانبًا for التحدث معي privately.",
    },
    {
      english: "comparative",
      arabic: "مقارن",
      sentence: "We studied the comparative advantages of both systems.",
      sentenceArabic: "درسنا المزايا المقارنة لكلا النظامين.",
    },
    {
      english: "completion",
      arabic: "إكمال",
      sentence: "The completion of the project is scheduled for next year.",
      sentenceArabic: "من المقرر إكمال المشروع in العام المقبل.",
    },
    {
      english: "compose",
      arabic: "يؤلف",
      sentence: "Mozart composed this symphony when he was a child.",
      sentenceArabic: "ألف موزارت هذه السيمفونية when كان طفلاً.",
    },
    {
      english: "composer",
      arabic: "ملحن",
      sentence: "Beethoven is one of the greatest composers of all time.",
      sentenceArabic: "بيتهوفن هو أحد أعظم الملحنين in كل العصور.",
    },
    {
      english: "compound",
      arabic: "مركب / يضاعف",
      sentence:
        "1. Water is a compound of hydrogen and oxygen. 2. The problem was compounded by bad weather.",
      sentenceArabic:
        "1. الماء هو مركب من الهيدروجين والأكسجين. 2. تفاقمت المشكلة due إلى سوء الطقس.",
    },
    {
      english: "comprehensive",
      arabic: "شامل",
      sentence: "We need a comprehensive solution to this problem.",
      sentenceArabic: "نحن بحاجة إلى حل شامل for هذه المشكلة.",
    },
    {
      english: "comprise",
      arabic: "يتكون من",
      sentence: "The committee comprises representatives from ten countries.",
      sentenceArabic: "تتكون اللجنة من ممثلين from عشر دول.",
    },
    {
      english: "compulsory",
      arabic: "إجباري",
      sentence: "Military service is compulsory in some countries.",
      sentenceArabic: "الخدمة العسكرية إجبارية in بعض البلدان.",
    },
    {
      english: "concrete",
      arabic: "ملموس / خرسانة",
      sentence:
        "1. We need concrete evidence, not just theories. 2. The building is made of concrete and steel.",
      sentenceArabic:
        "1. نحتاج إلى دليل ملموس، ليس مجرد نظريات. 2. المبنى مصنوع من الخرسانة والفولاذ.",
    },
    {
      english: "confess",
      arabic: "يعترف",
      sentence: "He finally confessed to the crime.",
      sentenceArabic: "أخيرًا اعترف by الجريمة.",
    },
    {
      english: "confusion",
      arabic: "ارتباك",
      sentence: "There was some confusion about the meeting time.",
      sentenceArabic: "كان هناك بعض الارتباك about وقت الاجتماع.",
    },
    {
      english: "consequently",
      arabic: "وبالتالي",
      sentence: "He didn't study, and consequently, he failed the exam.",
      sentenceArabic: "هو لم يدرس، and وبالتالي، فشل في الامتحان.",
    },
    {
      english: "conservation",
      arabic: "حفظ / صون",
      sentence:
        "Wildlife conservation is important for protecting endangered species.",
      sentenceArabic:
        "الحفاظ على الحياة البرية important لحماية الأنواع المهددة بالانقراض.",
    },
    {
      english: "considerable",
      arabic: "كبير / معتبر",
      sentence: "The project requires a considerable amount of money.",
      sentenceArabic: "المشروع requires مقدارًا كبيرًا من المال.",
    },
    {
      english: "considerably",
      arabic: "إلى حد كبير",
      sentence: "The price has increased considerably since last year.",
      sentenceArabic: "ارتفع السعر considerably since العام الماضي.",
    },
    {
      english: "consistently",
      arabic: "باستمرار",
      sentence: "She has consistently performed well in her job.",
      sentenceArabic: "أداؤها كان جيدًا باستمرار in وظيفتها.",
    },
    {
      english: "conspiracy",
      arabic: "مؤامرة",
      sentence: "He was accused of conspiracy to commit murder.",
      sentenceArabic: "اتُهم by المؤامرة for ارتكاب القتل.",
    },
    {
      english: "consult",
      arabic: "يستشير",
      sentence: "You should consult a doctor about your symptoms.",
      sentenceArabic: "يجب أن تستشير طبيبًا about أعراضك.",
    },
    {
      english: "consultant",
      arabic: "مستشار",
      sentence: "The company hired a marketing consultant.",
      sentenceArabic: "قامت الشركة بتعيين مستشار تسويق.",
    },
    {
      english: "dramatically",
      arabic: "بشكل كبير / مثير",
      sentence: "Sales have increased dramatically this quarter.",
      sentenceArabic: "زادت المبيعات dramatically هذا الربع.",
    },
    {
      english: "drought",
      arabic: "جفاف",
      sentence: "The long drought destroyed the farmers' crops.",
      sentenceArabic: "دمر الجفاف الطويل محاصيل المزارعين.",
    },
    {
      english: "dull",
      arabic: "ممل",
      sentence: "The lecture was rather dull.",
      sentenceArabic: "كانت المحاضرة مملة rather.",
    },
    {
      english: "dump",
      arabic: "مقلب نفايات / يرمي",
      sentence:
        "1. Don't leave your trash here, take it to the dump. 2. He dumped his old furniture on the sidewalk.",
      sentenceArabic:
        "1. لا تترك قمامتك here، خذها to مقلب النفايات. 2. رمى أثاثه القديم on الرصيف.",
    },
    {
      english: "duration",
      arabic: "مدة",
      sentence: "The duration of the film is two hours.",
      sentenceArabic: "مدة الفيلم ساعتان.",
    },
    {
      english: "economics",
      arabic: "اقتصاد",
      sentence: "She has a degree in economics.",
      sentenceArabic: "لديها درجة in الاقتصاد.",
    },
    {
      english: "economist",
      arabic: "اقتصادي",
      sentence: "Leading economists are predicting a recession.",
      sentenceArabic: "يتوقع الاقتصاديون البارزون ركودًا.",
    },
    {
      english: "editorial",
      arabic: "تحريري / مقالة رئيسية",
      sentence:
        "1. She has editorial control over the magazine. 2. The newspaper published an editorial criticizing the government.",
      sentenceArabic:
        "1. لديها سيطرة تحريرية on المجلة. 2. نشرت الجريدة مقالة رئيسية تنتقد الحكومة.",
    },
    {
      english: "efficiently",
      arabic: "بكفاءة",
      sentence: "The new system works more efficiently.",
      sentenceArabic: "النظام الجديد يعمل بكفاءة more.",
    },
    {
      english: "elbow",
      arabic: "كوع",
      sentence: "She hurt her elbow when she fell.",
      sentenceArabic: "ألحقت الضرر بكوعها when سقطت.",
    },
    {
      english: "electronics",
      arabic: "إلكترونيات",
      sentence: "He is an expert in electronics.",
      sentenceArabic: "هو خبير in الإلكترونيات.",
    },
    {
      english: "elegant",
      arabic: "أنيق",
      sentence: "She was wearing an elegant black dress.",
      sentenceArabic: "كانت ترتدي فستانًا أسودًا أنيقًا.",
    },
    {
      english: "elementary",
      arabic: "ابتدائي",
      sentence: "My daughter is in elementary school.",
      sentenceArabic: "ابنتي في المدرسة الابتدائية.",
    },
    {
      english: "eliminate",
      arabic: "يستبعد / يلغي",
      sentence: "We need to eliminate all possible errors.",
      sentenceArabic: "نحن بحاجة إلى استبعاد جميع الأخطاء possible.",
    },
    {
      english: "embrace",
      arabic: "يعانق / يحتضن",
      sentence:
        "1. She embraced her old friend warmly. 2. We should embrace new technologies.",
      sentenceArabic:
        "1. عانقت صديقتها القديمة بحرارة. 2. يجب أن نحتضن التقنيات الجديدة.",
    },
    {
      english: "emission",
      arabic: "انبعاث",
      sentence: "The government wants to reduce carbon emissions.",
      sentenceArabic: "تريد الحكومة خفض انبعاثات الكربون.",
    },
    {
      english: "emotionally",
      arabic: "عاطفياً",
      sentence: "She was emotionally drained after the argument.",
      sentenceArabic: "كانت مستنزفة عاطفيًا after المشاجرة.",
    },
    {
      english: "empire",
      arabic: "إمبراطورية",
      sentence: "The Roman Empire was vast.",
      sentenceArabic: "كانت الإمبراطورية الرومانية شاسعة.",
    },
    {
      english: "enjoyable",
      arabic: "ممتع",
      sentence: "We had an enjoyable evening at the theatre.",
      sentenceArabic: "قضينا أمسية ممتعة in المسرح.",
    },
    {
      english: "entertaining",
      arabic: "مسل",
      sentence: "The book is both informative and entertaining.",
      sentenceArabic: "الكتاب both معلوماتي ومسل.",
    },
    {
      english: "hidden",
      arabic: "مخفي",
      sentence: "The door was hidden behind a large curtain.",
      sentenceArabic: "كان الباب مخفيًا behind ستارة كبيرة.",
    },
    {
      english: "highway",
      arabic: "طريق سريع",
      sentence: "We drove on the highway for most of the journey.",
      sentenceArabic: "قدنا on الطريق السريع during معظم الرحلة.",
    },
    {
      english: "hilarious",
      arabic: "مضحك جداً",
      sentence: "The comedian was hilarious.",
      sentenceArabic: "كان الكوميدي مضحكًا جدًا.",
    },
    {
      english: "hip",
      arabic: "ورك / عصري",
      sentence:
        "1. She broke her hip in the fall. 2. That's a very hip neighborhood.",
      sentenceArabic: "1. كسرت وركها in السقوط. 2. هذا حي عصري very.",
    },
    {
      english: "historian",
      arabic: "مؤرخ",
      sentence: "The historian wrote a book about ancient Egypt.",
      sentenceArabic: "كتب المؤرخ كتابًا about مصر القديمة.",
    },
    {
      english: "homeless",
      arabic: "مشرد",
      sentence: "The charity provides food for the homeless.",
      sentenceArabic: "تقدم الجمعية الخيرية الطعام for المشردين.",
    },
    {
      english: "honesty",
      arabic: "صدق",
      sentence: "I appreciate your honesty.",
      sentenceArabic: "أقدر صدقك.",
    },
    {
      english: "hopefully",
      arabic: "نأمل",
      sentence: "Hopefully, the weather will be nice tomorrow.",
      sentenceArabic: "نأمل، سيكون الطقس جميلًا غدًا.",
    },
    {
      english: "hunger",
      arabic: "جوع",
      sentence: "Many people in the world suffer from hunger.",
      sentenceArabic: "الكثير من الناس in العالم يعانون from الجوع.",
    },
    {
      english: "hypothesis",
      arabic: "فرضية",
      sentence: "The scientist tested her hypothesis with an experiment.",
      sentenceArabic: "اختبرت العالمة فرضيتها with تجربة.",
    },
    {
      english: "icon",
      arabic: "أيقونة",
      sentence: "Click on the icon to open the program.",
      sentenceArabic: "انقر on الأيقونة for فتح البرنامج.",
    },
    {
      english: "ID",
      arabic: "هوية",
      sentence: "You need to show your ID to enter the building.",
      sentenceArabic: "أنت بحاجة to إظهار هويتك for دخول المبنى.",
    },
    {
      english: "identical",
      arabic: "مطابق",
      sentence: "The two sisters are identical twins.",
      sentenceArabic: "الأختان توأمان متماثلان.",
    },
    {
      english: "illusion",
      arabic: "وهم",
      sentence: "The magician created the illusion that he had disappeared.",
      sentenceArabic: "خلق الساحر وهم thatهو اختفى.",
    },
    {
      english: "immigration",
      arabic: "هجرة",
      sentence: "He works for the immigration department.",
      sentenceArabic: "هو يعمل in department الهجرة.",
    },
    {
      english: "immune",
      arabic: "مُحصّن",
      sentence: "Vaccination makes you immune to the disease.",
      sentenceArabic: "التطعيم makes لك immune against المرض.",
    },
    {
      english: "implement",
      arabic: "ينفذ",
      sentence: "The company will implement the new policy next month.",
      sentenceArabic: "ستنفذ الشركة السياسة الجديدة الشهر المقبل.",
    },
    {
      english: "implication",
      arabic: "تضمين /暗示",
      sentence: "The implications of the decision are serious.",
      sentenceArabic: "تضمنات القرار خطيرة.",
    },
    {
      english: "incentive",
      arabic: "حافز",
      sentence: "The bonus is an incentive for employees to work harder.",
      sentenceArabic: "المكافأة هي حافز for الموظفين for العمل harder.",
    },
    {
      english: "incorporate",
      arabic: "يدمج",
      sentence: "We need to incorporate their suggestions into the plan.",
      sentenceArabic: "نحن بحاجة إلى دمج اقتراحاتهم into الخطة.",
    },
    {
      english: "incorrect",
      arabic: "غير صحيح",
      sentence: "Your answer is incorrect.",
      sentenceArabic: "إجابتك غير صحيحة.",
    },
    {
      english: "independence",
      arabic: "استقلال",
      sentence: "The country gained its independence in 1948.",
      sentenceArabic: "حصل البلد على استقلاله in 1948.",
    },
    {
      english: "index",
      arabic: "فهرس / مؤشر",
      sentence:
        "1. Check the index at the back of the book. 2. The stock market index fell today.",
      sentenceArabic:
        "1. تحقق من الفهرس in نهاية الكتاب. 2. انخفض مؤشر سوق الأسهم today.",
    },
    {
      english: "indication",
      arabic: "إشارة",
      sentence: "There is no indication that he will resign.",
      sentenceArabic: "لا توجد إشارة that هو سيستقيل.",
    },
    {
      english: "inevitable",
      arabic: "حتمي",
      sentence: "Change is inevitable.",
      sentenceArabic: "التغيير حتمي.",
    },
    {
      english: "inevitably",
      arabic: "حتمياً",
      sentence: "Inevitably, prices will rise.",
      sentenceArabic: "حتمًا، سترتفع الأسعار.",
    },
    {
      english: "infer",
      arabic: "يستنتج",
      sentence: "From his tone, I inferred that he was angry.",
      sentenceArabic: "From نبرة صوته، استنتجت that هو كان غاضبًا.",
    },
    {
      english: "miner",
      arabic: "عامل مناجم",
      sentence: "The miners went on strike for better safety conditions.",
      sentenceArabic: "اضر عمال المناجم from أجل ظروف safety أفضل.",
    },
    {
      english: "miserable",
      arabic: "بائس",
      sentence: "I felt miserable with a cold and fever.",
      sentenceArabic: "شعرت بالبؤس with برد وحمى.",
    },
    {
      english: "mode",
      arabic: "نمط / وضع",
      sentence:
        "1. The camera has an automatic mode. 2. She was in a cheerful mode.",
      sentenceArabic: "1. الكاميرا لديها وضع تلقائي. 2. كانت في نمط مرح.",
    },
    {
      english: "modest",
      arabic: "متواضع",
      sentence: "She is very modest about her achievements.",
      sentenceArabic: "هي متواضعة very about إنجازاتها.",
    },
    {
      english: "monster",
      arabic: "وحش",
      sentence: "The children were afraid of the monster under the bed.",
      sentenceArabic: "كان الأطفال خائفين from الوحش under السرير.",
    },
    {
      english: "monthly",
      arabic: "شهري",
      sentence: "We have a monthly team meeting.",
      sentenceArabic: "لدينا اجتماع فريق شهري.",
    },
    {
      english: "monument",
      arabic: "نصب تذكاري",
      sentence: "We visited the ancient monuments in the city.",
      sentenceArabic: "زرنا النصب التذكارية القديمة in المدينة.",
    },
    {
      english: "moreover",
      arabic: "علاوة على ذلك",
      sentence: "The price is too high, and moreover, the quality is poor.",
      sentenceArabic: "السعر مرتفع جدًا، and علاوة على ذلك، الجودة رديئة.",
    },
    {
      english: "mortgage",
      arabic: "قرض عقاري",
      sentence: "They took out a mortgage to buy the house.",
      sentenceArabic: "أخذوا قرضًا عقاريًا for شراء المنزل.",
    },
    {
      english: "mosque",
      arabic: "مسجد",
      sentence: "The mosque is the center of the Muslim community.",
      sentenceArabic: "المسجد هو مركز المجتمع المسلم.",
    },
    {
      english: "motion",
      arabic: "حركة",
      sentence: "She made a motion with her hand to tell me to stop.",
      sentenceArabic: "أدت حركة by يدها for تخبرني بالتوقف.",
    },
    {
      english: "motivate",
      arabic: "يحفز",
      sentence: "A good teacher knows how to motivate students.",
      sentenceArabic: "المعلم الجيد knows كيف يحفز الطلاب.",
    },
    {
      english: "motivation",
      arabic: "حافز",
      sentence: "What is your motivation for learning English?",
      sentenceArabic: "ما هو حافزك for تعلم الإنجليزية؟",
    },
    {
      english: "moving",
      arabic: "مؤثر / متحرك",
      sentence:
        "1. The speech was very moving. 2. Be careful of moving parts in the machine.",
      sentenceArabic:
        "1. كانت الخطابة مؤثرة very. 2. كن حذرًا from الأجزاء المتحركة in الآلة.",
    },
    {
      english: "myth",
      arabic: "أسطورة",
      sentence: "The story is based on an ancient Greek myth.",
      sentenceArabic: "القصة based على أسطورة يونانية قديمة.",
    },
    {
      english: "naked",
      arabic: "عاري",
      sentence: "The baby was lying naked on the towel.",
      sentenceArabic: "كان الطفل مستلقيًا عاريًا on المنشفة.",
    },
    {
      english: "nasty",
      arabic: "سيء / مقرف",
      sentence: "He has a nasty temper.",
      sentenceArabic: "لديه مزاج سيء.",
    },
    {
      english: "navigation",
      arabic: "ملاحة",
      sentence:
        "The navigation system in the car guided us to our destination.",
      sentenceArabic: "وجهنا نظام الملاحة in السيارة to وجهتنا.",
    },
    {
      english: "nearby",
      arabic: "قريب",
      sentence: "There is a good restaurant nearby.",
      sentenceArabic: "هناك مطعم جيد قريب.",
    },
    {
      english: "necessity",
      arabic: "ضرورة",
      sentence: "Food and water are basic necessities.",
      sentenceArabic: "الطعام والماء ضروريات أساسية.",
    },
    {
      english: "negotiate",
      arabic: "يتفاوض",
      sentence: "The union will negotiate with management for better wages.",
      sentenceArabic: "سيتفاوض النقاب with الإدارة from أجل أجور أفضل.",
    },
    {
      english: "negotiation",
      arabic: "مفاوضات",
      sentence: "The negotiations between the two companies lasted for weeks.",
      sentenceArabic: "استمرت المفاوضات between الشركتين for أسابيع.",
    },
    {
      english: "neutral",
      arabic: "محايد",
      sentence: "Switzerland remained neutral during the war.",
      sentenceArabic: "بقيت سويسرا محايدة during الحرب.",
    },
    {
      english: "newly",
      arabic: "حديثاً",
      sentence: "They are a newly married couple.",
      sentenceArabic: "هم زوجان حديثا الزواج.",
    },
    {
      english: "punk",
      arabic: "پانك",
      sentence: "He was a punk rocker in the 1980s.",
      sentenceArabic: "كان مغني پانك روك in الثمانينيات.",
    },
    {
      english: "purely",
      arabic: "بحت",
      sentence: "I did it purely out of curiosity.",
      sentenceArabic: "فعلت ذلك بحت out من الفضول.",
    },
    {
      english: "pursuit",
      arabic: "مطاردة / سعي",
      sentence:
        "1. The police were in pursuit of the stolen car. 2. the pursuit of happiness",
      sentenceArabic:
        "1. كانت الشرطة in مطاردة السيارة المسروقة. 2. السعي وراء السعادة",
    },
    {
      english: "puzzle",
      arabic: "لغز",
      sentence: "I enjoy doing crossword puzzles.",
      sentenceArabic: "أستمتع بحل الألغاز المتقاطعة.",
    },
    {
      english: "questionnaire",
      arabic: "استبيان",
      sentence: "Please complete this questionnaire and return it to us.",
      sentenceArabic: "يرجى إكمال هذا الاستبيان and إعادته to لنا.",
    },
    {
      english: "racial",
      arabic: "عرقي",
      sentence: "They are victims of racial discrimination.",
      sentenceArabic: "هم ضحايا التمييز العرقي.",
    },
    {
      english: "racism",
      arabic: "عنصرية",
      sentence: "We must fight against racism.",
      sentenceArabic: "يجب أن نحارب against العنصرية.",
    },
    {
      english: "racist",
      arabic: "عنصري",
      sentence: "His racist comments were widely condemned.",
      sentenceArabic: "أدانت تعليقاته العنصرية widely.",
    },
    {
      english: "radiation",
      arabic: "إشعاع",
      sentence: "The machine emits harmful radiation.",
      sentenceArabic: "الآلة تبعث إشعاعًا ضارًا.",
    },
    {
      english: "rail",
      arabic: "سكة حديد",
      sentence: "The goods were transported by rail.",
      sentenceArabic: "تم نقل البضائع by السكة الحديد.",
    },
    {
      english: "random",
      arabic: "عشوائي",
      sentence: "The computer generates random numbers.",
      sentenceArabic: "يولد الكمبيوتر أرقامًا عشوائية.",
    },
    {
      english: "rat",
      arabic: "جرذ",
      sentence: "The laboratory uses rats for experiments.",
      sentenceArabic: "المختبرات تستخدم جراز في التجارب",
    },
    {
      english: "rating",
      arabic: "تقييم",
      sentence: "The movie has a high rating on the website.",
      sentenceArabic: "الفيلم لديه تقييم high on الموقع الإلكتروني.",
    },
    {
      english: "reasonably",
      arabic: "بمعقولية",
      sentence: "The car is reasonably priced.",
      sentenceArabic: "سيارة priced بمعقولية.",
    },
    {
      english: "rebuild",
      arabic: "يعيد بناء",
      sentence: "After the earthquake, they had to rebuild the city.",
      sentenceArabic: "After الزلزال، كان عليهم إعادة بناء المدينة.",
    },
    {
      english: "receiver",
      arabic: "مستقبل / سماعة",
      sentence:
        "1. He put down the telephone receiver. 2. The radio receiver wasn't working.",
      sentenceArabic: "1. وضع سماعة الهاتف. 2. مستقبل الراديو wasn't يعمل.",
    },
    {
      english: "recession",
      arabic: "ركود",
      sentence: "The economy is in recession.",
      sentenceArabic: "الاقتصاد in ركود.",
    },
    {
      english: "reckon",
      arabic: "يحسب / يظن",
      sentence:
        "1. I reckon it will cost about $100. 2. He is reckoned to be the best player in the team.",
      sentenceArabic:
        "1. I reckon أنها ستكلف about 100 دولار. 2. هو يُعتبر best لاعب in الفريق.",
    },
    {
      english: "recognition",
      arabic: "اعتراف",
      sentence: "He received recognition for his hard work.",
      sentenceArabic: "تلقى اعترافًا on عمله الجاد.",
    },
    {
      english: "recovery",
      arabic: "شفاء / تعاف",
      sentence: "She made a full recovery after the surgery.",
      sentenceArabic: "أتمت الشفاء التام after الجراحة.",
    },
    {
      english: "recruit",
      arabic: "يجند / يوظف",
      sentence: "The army is trying to recruit new soldiers.",
      sentenceArabic: "يحاول الجيش تجنيد جنود جدد.",
    },
    {
      english: "recruitment",
      arabic: "توظيف",
      sentence: "The company has frozen its recruitment process.",
      sentenceArabic: "جمدت الشركة عملية التوظيف الخاصة بها.",
    },
    {
      english: "referee",
      arabic: "حكم",
      sentence: "The referee blew his whistle to stop the game.",
      sentenceArabic: "أطلق الحكم صافرته for إيقاف اللعبة.",
    },
    {
      english: "refugee",
      arabic: "لاجئ",
      sentence: "The camp provides shelter for thousands of refugees.",
      sentenceArabic: "توفر المخيم المأوى for آلاف اللاجئين.",
    },
    {
      english: "registration",
      arabic: "تسجيل",
      sentence: "Please complete the registration form.",
      sentenceArabic: "يرجى إكمال نموذج التسجيل.",
    },
    {
      english: "regulate",
      arabic: "ينظم",
      sentence: "The government regulates the industry.",
      sentenceArabic: "تنظم الحكومة الصناعة.",
    },
    {
      english: "reinforce",
      arabic: "يعزز",
      sentence: "The news reinforced my belief that he was lying.",
      sentenceArabic: "عززت الأخبار اعتقادي that هو كان يكذب.",
    },
    {
      english: "relieve",
      arabic: "يخفف",
      sentence: "This medicine will relieve the pain.",
      sentenceArabic: "هذا الدواء will يخفف الألم.",
    },
    {
      english: "relieved",
      arabic: "مرتاح",
      sentence: "I was relieved to hear that you are safe.",
      sentenceArabic: "كنت مرتاحًا to أسمع that أنت بأمان.",
    },
    {
      english: "strengthen",
      arabic: "يقوي",
      sentence: "Exercises will strengthen your muscles.",
      sentenceArabic: "التمارين will تقوي عضلاتك.",
    },
    {
      english: "strictly",
      arabic: "بصرامة",
      sentence: "Smoking is strictly prohibited.",
      sentenceArabic: "التدخين prohibited بصرامة.",
    },
    {
      english: "striking",
      arabic: "لافت للنظر",
      sentence: "There is a striking resemblance between the two sisters.",
      sentenceArabic: "هناك تشابه لافت للنظر between الأختين.",
    },
    {
      english: "stroke",
      arabic: "سكتة دماغية / ضربة",
      sentence:
        "1. He suffered a stroke last year. 2. She painted the wall with broad strokes.",
      sentenceArabic:
        "1. عانى from سكتة دماغية last year. 2. رسمت الجدار بضربات broad.",
    },
    {
      english: "stunning",
      arabic: "أخّاذ / مذهل",
      sentence: "She looked stunning in her wedding dress.",
      sentenceArabic: "بدت مذهلة in فستان زفافها.",
    },
    {
      english: "subsequent",
      arabic: "لاحق",
      sentence: "Subsequent events proved that he was right.",
      sentenceArabic: "أثبتت الأحداث اللاحقة that هو كان على حق.",
    },
    {
      english: "subsequently",
      arabic: "بعد ذلك",
      sentence:
        "He was injured in the accident and subsequently died in hospital.",
      sentenceArabic: "أصيب in الحادث and بعد ذلك مات in المستشفى.",
    },
    {
      english: "suburb",
      arabic: "ضاحية",
      sentence: "They live in a quiet suburb of London.",
      sentenceArabic: "هم يعيشون in ضاحية هادئة of لندن.",
    },
    {
      english: "suffering",
      arabic: "معاناة",
      sentence: "The war caused widespread suffering.",
      sentenceArabic: "تسببت الحرب في معاناة واسعة النطاق.",
    },
    {
      english: "sufficient",
      arabic: "كاف",
      sentence: "Do we have sufficient food for everyone?",
      sentenceArabic: "هل لدينا طعام كاف for الجميع؟",
    },
    {
      english: "sufficiently",
      arabic: "بما فيه الكفاية",
      sentence: "The room was not sufficiently heated.",
      sentenceArabic: "الغرفة weren't heated بما فيه الكفاية.",
    },
    {
      english: "super",
      arabic: "رائع",
      sentence: "We had a super time at the party.",
      sentenceArabic: "قضينا وقتًا رائعًا in الحفلة.",
    },
    {
      english: "surgeon",
      arabic: "جراح",
      sentence: "The surgeon performed the operation successfully.",
      sentenceArabic: "أجرى الجراح العملية successfully.",
    },
    {
      english: "survival",
      arabic: "بقاء",
      sentence: "The survival of the species is under threat.",
      sentenceArabic: "بقاء النوع under التهديد.",
    },
    {
      english: "survivor",
      arabic: "ناج",
      sentence: "She was the only survivor of the crash.",
      sentenceArabic: "كانت الناجية الوحيدة of التحطم.",
    },
    {
      english: "suspend",
      arabic: "يعلق",
      sentence: "The player was suspended for three matches.",
      sentenceArabic: "تم تعليق اللاعب for ثلاث مباريات.",
    },
    {
      english: "sustainable",
      arabic: "مستدام",
      sentence: "We need to find sustainable sources of energy.",
      sentenceArabic: "نحن بحاجة إلى إيجاد مصادر مستدامة للطاقة.",
    },
    {
      english: "swallow",
      arabic: "يبلع / سنونو",
      sentence:
        "1. You need to swallow the pill. 2. We saw a swallow building its nest.",
      sentenceArabic: "1. أنت بحاجة to بلع الحبة. 2. رأينا سنونو يبني عشه.",
    },

    {
      english: "adequate",
      arabic: "كافٍ / مُناسِب",
      sentence: "The hotel room was adequate for a short stay.",
      sentenceArabic: "كانت غرفة الفندق كافية للإقامة القصيرة.",
    },
    {
      english: "adequately",
      arabic: "بِصورةٍ كافية",
      sentence: "The problem wasn't adequately addressed.",
      sentenceArabic: "لم يتم معالجة المشكلة بِصورةٍ كافية.",
    },
    {
      english: "adjust",
      arabic: "يَضبِط / يَتعايش",
      sentence: "It took him time to adjust to the new culture.",
      sentenceArabic: "استغرق منه الأمر وقتًا ليتعايش مع الثقافة الجديدة.",
    },
    {
      english: "affordable",
      arabic: "في المُتناوَل / مُمكِن الشراء",
      sentence: "They are looking for an affordable apartment.",
      sentenceArabic: "هم يبحثون عن شقة سعرها في المُتناوَل.",
    },
    {
      english: "agriculture",
      arabic: "زِراعة",
      sentence: "Agriculture is the main source of income in this region.",
      sentenceArabic: "الزِراعة هي المصدر الرئيسي للدخل في هذه المنطقة.",
    },
    {
      english: "casual",
      arabic: "عَرضي / غير رَسْمي",
      sentence: "The dress code for the party is casual.",
      sentenceArabic: "لباس الحفل غير رَسْمي.",
    },
    {
      english: "cave",
      arabic: "كَهف",
      sentence: "They explored a large cave during their trip.",
      sentenceArabic: "استكشفوا كَهفًا كبيرًا durante رحلتهم.",
    },
    {
      english: "certainty",
      arabic: "يَقين / تأكيد",
      sentence: "There's no certainty that the deal will happen.",
      sentenceArabic: "ليس هناك يَقين من أن الصفقة ستتم.",
    },
    {
      english: "certificate",
      arabic: "شَهادة",
      sentence: "She received a certificate for completing the course.",
      sentenceArabic: "حصلت على شَهادة لإكمالها الدورة.",
    },
    {
      english: "challenging",
      arabic: "يَحتَوي على تَحَدٍّ / صَعْب",
      sentence: "He found the new job very challenging.",
      sentenceArabic: "وجد أن الوظيفة الجديدة تَحتَوي على تَحَدٍّ كبير.",
    },
    {
      english: "championship",
      arabic: "بُطولة",
      sentence: "Our team won the national championship.",
      sentenceArabic: "فاز فريقنا بالبُطولة الوطنية.",
    },
    {
      english: "charming",
      arabic: "سَاحِر / جذاب",
      sentence: "We visited a charming little village.",
      sentenceArabic: "زرنا قرية صغيرة سَاحِرَة.",
    },
    {
      english: "chase",
      arabic: "مطارَدة / يطارد",
      sentence: "The police chased the stolen car.",
      sentenceArabic: "طاردت الشرطة السيارة المسروقة.",
    },
    {
      english: "cheek",
      arabic: "خَد",
      sentence: "She kissed her son on the cheek.",
      sentenceArabic: "قبّلت ابنها على خَدّه.",
    },
    {
      english: "cheer",
      arabic: "يَهتِف / تشجيع",
      sentence: "The fans cheer for their team every week.",
      sentenceArabic: "يَهتِف المشجعون لفريقهم every week.",
    },
    {
      english: "choir",
      arabic: "جوقة / كورال",
      sentence: "She sings in the church choir.",
      sentenceArabic: "هي تغني في جوقة الكنيسة.",
    },
    {
      english: "chop",
      arabic: "يقطع (بفأس أو سكين كبيرة)",
      sentence: "Chop the onions into small pieces.",
      sentenceArabic: "اقطع البصل إلى قطع صغيرة.",
    },
    {
      english: "circuit",
      arabic: "دائرة (كهربائية) / مسار",
      sentence: "A fault in the electrical circuit caused the blackout.",
      sentenceArabic: "سبب عطل في الدائرة الكهربائية الانقطاع.",
    },
    {
      english: "civilization",
      arabic: "حَضارة",
      sentence: "Ancient Egyptian civilization is fascinating.",
      sentenceArabic: "حَضارة مصر القديمة رائعة.",
    },
    {
      english: "clarify",
      arabic: "يُوَضِّح",
      sentence: "Could you clarify what you mean?",
      sentenceArabic: "هل could you أن تُوَضِّح ما تعنيه؟",
    },
    {
      english: "classify",
      arabic: "يُصَنِّف",
      sentence: "Scientists classify animals into different groups.",
      sentenceArabic: "يُصَنِّف العلماء الحيوانات إلى مجموعات مختلفة.",
    },
    {
      english: "clerk",
      arabic: "موظف (استقبال / مكتب)",
      sentence: "The hotel clerk helped us with our bags.",
      sentenceArabic: "ساعدنا موظف الاستقبال في الفندق بأمتعتنا.",
    },
    {
      english: "cliff",
      arabic: "جُرْف / منحدر صخري",
      sentence: "The castle was built on top of a cliff.",
      sentenceArabic: "بُنِيَت القلعة على قمة جُرْف.",
    },
    {
      english: "clinic",
      arabic: "عِيادة",
      sentence: "I have an appointment at the dental clinic.",
      sentenceArabic: "لدي موعد في عِيادة طبيب الأسنان.",
    },
    {
      english: "clip",
      arabic: "مَشبَك / مقطع (فيديو)",
      sentence: "She watched a short clip from the movie.",
      sentenceArabic: "شاهدت مقطعًا قصيرًا from الفيلم.",
    },
    {
      english: "coincidence",
      arabic: "صُدفة",
      sentence: "Meeting you here is a happy coincidence!",
      sentenceArabic: "مقابلتك هنا صُدفة سعيدة!",
    },
    {
      english: "collector",
      arabic: "جامع / هاوٍ",
      sentence: "He is a passionate stamp collector.",
      sentenceArabic: "هو جامع طوابع شغوف.",
    },
    {
      english: "colony",
      arabic: "مُستعمَرة / مستعمرة",
      sentence: "The country was formerly a British colony.",
      sentenceArabic: "كانت الدولة سابقًا مُستعمَرة بريطانية.",
    },
    {
      english: "colourful",
      arabic: "مُلَوَّن / زاهي الألوان",
      sentence: "She wore a colourful dress to the festival.",
      sentenceArabic: "ارتدت فستانًا زاهي الألوان في المهرجان.",
    },
    {
      english: "comic",
      arabic: "هزلي / كوميدي",
      sentence: "He prefers reading comic books.",
      sentenceArabic: "هو يفضل قراءة الكتب الهزلية.",
    },
    {
      english: "commander",
      arabic: "قائِد",
      sentence: "The commander gave the order to advance.",
      sentenceArabic: "أعطى القائِد الأمر بالتقدم.",
    },
    {
      english: "determination",
      arabic: "عَزيمة / إصرار",
      sentence: "Her determination helped her succeed.",
      sentenceArabic: "ساعدتها عَزيمتها على النجاح.",
    },
    {
      english: "devote",
      arabic: "يُكرِّس / يخصص",
      sentence: "He devotes two hours a day to studying.",
      sentenceArabic: "هو يُكرِّس ساعتين daily للدراسة.",
    },
    {
      english: "differ",
      arabic: "يَختلِف",
      sentence: "Our opinions differ on this topic.",
      sentenceArabic: "آراؤنا تَختلِف في هذا الموضوع.",
    },
    {
      english: "disability",
      arabic: "إعاقة",
      sentence: "The building has access for people with disabilities.",
      sentenceArabic: "المبنى يحتوي on مداخل for أصحاب الإعاقة.",
    },
    {
      english: "disabled",
      arabic: "ذو إعاقة / معاق",
      sentence: "Parking spaces are reserved for disabled drivers.",
      sentenceArabic: "أماكن الانتظار محجوزة for السائقين ذوي الإعاقة.",
    },
    {
      english: "disagreement",
      arabic: "خِلاف / اختلاف في الرأي",
      sentence: "They had a disagreement about where to go.",
      sentenceArabic: "كان betweenهم خِلاف حول المكان الذاهبين إليه.",
    },
    {
      english: "disappoint",
      arabic: "يُخيِّب الأمل",
      sentence: "I don't want to disappoint my parents.",
      sentenceArabic: "لا أريد أن أُخيِّب أمل والديّ.",
    },
    {
      english: "disappointment",
      arabic: "خيبة أمل",
      sentence: "Losing the match was a great disappointment.",
      sentenceArabic: "كانت خسارة المباراة خيبة أمل كبيرة.",
    },
    {
      english: "discourage",
      arabic: "يُثبِّط العزيمة",
      sentence: "Don't let failure discourage you.",
      sentenceArabic: "لا تسمح للفشل أن يُثبِّط عزيمتك.",
    },
    {
      english: "disorder",
      arabic: "اضطراب / فوضى",
      sentence: "The room was in complete disorder.",
      sentenceArabic: "كانت الغرفة في فوضى كاملة.",
    },
    {
      english: "distant",
      arabic: "بَعيد",
      sentence: "We could hear the distant sound of thunder.",
      sentenceArabic: "كنا نستطيع سماع صوت الرعد البَعيد.",
    },
    {
      english: "distinct",
      arabic: "مُميَّز / واضح",
      sentence: "There's a distinct possibility of rain.",
      sentenceArabic: "هناك إمكانية واضحة لسقوط المطر.",
    },
    {
      english: "distinguish",
      arabic: "يُـمَيِّز",
      sentence: "It's hard to distinguish between the twins.",
      sentenceArabic: "من الصعب أن تُـمَيِّز between التوأمين.",
    },
    {
      english: "distract",
      arabic: "يُشتِّت الانتباه",
      sentence: "The noise distracted me from my work.",
      sentenceArabic: "شتت الضجيج انتباهي about عملي.",
    },
    {
      english: "disturb",
      arabic: "يُزعِج",
      sentence: "Please do not disturb me while I'm working.",
      sentenceArabic: "من فضلك، لا تُزعِجني while أنا أعمل.",
    },
    {
      english: "dive",
      arabic: "يَغوص / يغطس",
      sentence: "We want to dive in the Red Sea.",
      sentenceArabic: "نريد أن نَغوص في البحر الأحمر.",
    },
    {
      english: "diverse",
      arabic: "مُتنوِّع",
      sentence: "The city has a diverse population.",
      sentenceArabic: "المدينة ذات سُكّان مُتنوِّعين.",
    },
    {
      english: "diversity",
      arabic: "تَنوُّع / تنوع",
      sentence: "Cultural diversity enriches society.",
      sentenceArabic: "الثقافة التَنوُّع يثري المجتمع.",
    },
    {
      english: "divorce",
      arabic: "طَلاق",
      sentence: "Their divorce was finalized last year.",
      sentenceArabic: "تم الانتهاء من طَلاقهم last year.",
    },
    {
      english: "dominant",
      arabic: "سائِد / مسيطر",
      sentence: "English is the dominant language in the business world.",
      sentenceArabic: "الإنجليزية هي اللغة السائِدة in عالم الأعمال.",
    },
    {
      english: "donation",
      arabic: "تَبرُّع / تبرع",
      sentence: "They made a donation to the charity.",
      sentenceArabic: "قدّموا تَبرُّعًا for الجمعية الخيرية.",
    },
    {
      english: "dot",
      arabic: "نُقطة",
      sentence: "The island was just a dot on the horizon.",
      sentenceArabic: "كانت الجزيرة مجرد نُقطة on الأفق.",
    },
    {
      english: "downtown",
      arabic: "وسط المَدينة / مركز المدينة",
      sentence: "Let's go downtown for dinner.",
      sentenceArabic: "لنذهب to وسط المَدينة for تناول العشاء.",
    },
    {
      english: "gaming",
      arabic: "ألعاب الفيديو / اللعب",
      sentence: "Gaming is a popular hobby among teenagers.",
      sentenceArabic: "ألعاب الفيديو hobby شائع among المراهقين.",
    },
    {
      english: "gay",
      arabic: "مثلي الجنس",
      sentence: "They are proud to support gay rights.",
      sentenceArabic: "هم فخورون بدعمهم rights المثليين.",
    },
    {
      english: "gender",
      arabic: "نوع جِنْسي / جندر",
      sentence: "Equality between genders is important.",
      sentenceArabic: "المساواة between الأنواع الجِنْسِية مهمة.",
    },
    {
      english: "gene",
      arabic: "مُوَرِّثة / جين",
      sentence:
        "Scientists are studying the gene responsible for this disease.",
      sentenceArabic: "يدرس العلماء المُوَرِّثة المسؤولة about هذا المرض.",
    },
    {
      english: "genetic",
      arabic: "وِراثي",
      sentence: "Some diseases have a genetic cause.",
      sentenceArabic: "بعض الأمراض لها سبب وِراثي.",
    },
    {
      english: "genius",
      arabic: "عَبقرية / عبقري",
      sentence: "Einstein was a genius.",
      sentenceArabic: "كان آينشتاين عبقريًا.",
    },
    {
      english: "genuine",
      arabic: "أصيل / حقيقي",
      sentence: "She has a genuine interest in art.",
      sentenceArabic: "لديها interest حقيقي in الفن.",
    },
    {
      english: "genuinely",
      arabic: "بِصورة حقيقية / حقًا",
      sentence: "I am genuinely happy for you.",
      sentenceArabic: "أنا سعيد for you بِصورة حقيقية.",
    },
    {
      english: "gesture",
      arabic: "إيماءة / حركة",
      sentence: "He made a gesture of apology.",
      sentenceArabic: "قام بـ إيماءة اعتذار.",
    },
    {
      english: "gig",
      arabic: "حَفْل موسيقي",
      sentence: "The band has a gig next Friday.",
      sentenceArabic: "الفرقة لديها حَفْل موسيقي next Friday.",
    },
    {
      english: "globalization",
      arabic: "عَوْلَمة",
      sentence: "Globalization has increased international trade.",
      sentenceArabic: "زادت العَوْلَمة from التجارة الدولية.",
    },
    {
      english: "globe",
      arabic: "كُرة أرضية / العالم",
      sentence: "They traveled across the globe.",
      sentenceArabic: "سافروا around الكرة الأرضية.",
    },
    {
      english: "golden",
      arabic: "ذهبي",
      sentence: "She won a golden medal at the Olympics.",
      sentenceArabic: "فازت بميدالية ذهبية in الأولمبياد.",
    },
    {
      english: "goodness",
      arabic: "طِيبة / صلاح",
      sentence: "Thank goodness you are safe!",
      sentenceArabic: "الحمد لله أنك safe!",
    },
    {
      english: "gorgeous",
      arabic: "رائع / بهي",
      sentence: "The view from the top was gorgeous.",
      sentenceArabic: "كان المنظر from القمة رائعًا.",
    },
    {
      english: "governor",
      arabic: "حاكِم / وال",
      sentence: "The governor of the state gave a speech.",
      sentenceArabic: "ألقى حاكِم الولاية خطابًا.",
    },
    {
      english: "graphic",
      arabic: "بصري / رسومي",
      sentence: "The movie contains graphic violence.",
      sentenceArabic: "يحتوي الفيلم on مشاهد عنف بصريّة.",
    },
    {
      english: "graphics",
      arabic: "رُسوميات / جرافيكس",
      sentence: "The video game has amazing graphics.",
      sentenceArabic: "لعبة الفيديو لها رُسوميات مذهلة.",
    },
    {
      english: "greatly",
      arabic: "إلى حد كبير / جدًا",
      sentence: "I greatly appreciate your help.",
      sentenceArabic: "أقدّر مساعدتك to حد كبير.",
    },
    {
      english: "greenhouse",
      arabic: "بيت زجاجي (لزراعة النباتات)",
      sentence: "They grow tomatoes in the greenhouse.",
      sentenceArabic: "هم يزرعون الطماطم in البيت الزجاجي.",
    },
    {
      english: "grocery",
      arabic: "بقالة / متجر غذائي",
      sentence: "I need to stop by the grocery store.",
      sentenceArabic: "أحتاج to التوقف at متجر البقالة.",
    },
    {
      english: "guideline",
      arabic: "إرشاد / دليل إرشادي",
      sentence: "Please follow the safety guidelines.",
      sentenceArabic: "من فضلك، اتّبع الإرشادات السلامة.",
    },
    {
      english: "habitat",
      arabic: "مَوْطِن / بيئة طبيعية",
      sentence: "Pollution is destroying the natural habitat of many animals.",
      sentenceArabic: "التلوث يُدَمِّر المَوْطِن الطبيعي for many حيوانات.",
    },
    {
      english: "harbour",
      arabic: "مِينَاء",
      sentence: "The ships sailed into the harbour.",
      sentenceArabic: "أبحرت السفن to inside المِينَاء.",
    },
    {
      english: "headquarters",
      arabic: "مَقَرّ رَئيسي",
      sentence: "The company's headquarters are in London.",
      sentenceArabic: "المَقَرّ الرَئيسي for الشركة in لندن.",
    },
    {
      english: "heal",
      arabic: "يَشفى / يشفي",
      sentence: "The wound will heal in a few weeks.",
      sentenceArabic: "سَتَشفى الجرح in خلال بضعة أسابيع.",
    },
    {
      english: "healthcare",
      arabic: "رعاية صِحِّية",
      sentence: "Access to good healthcare is a basic right.",
      sentenceArabic: "الوصول to رعاية صِحِّية جيدة حق أساسي.",
    },
    {
      english: "helmet",
      arabic: "خُوذة",
      sentence: "Always wear a helmet when riding a bike.",
      sentenceArabic: "always ارتدِ خُوذة when ركوب الدراجة.",
    },
    {
      english: "hence",
      arabic: "لِذَلِك / hence",
      sentence: "He was late, hence he missed the meeting.",
      sentenceArabic: "هو تأخر, لِذَلِك فَـقد الاجتماع.",
    },
    {
      english: "herb",
      arabic: "نَبْتة عُشبية / عشب",
      sentence: "She uses fresh herbs in her cooking.",
      sentenceArabic: "هي تستخدم نَبْتات عُشبية طازجة in طبخها.",
    },
    {
      english: "logo",
      arabic: "شِعار",
      sentence: "The company changed its logo.",
      sentenceArabic: "غيّرت الشركة شِعارها.",
    },
    {
      english: "lottery",
      arabic: "يانصيب",
      sentence: "He won a large amount of money in the lottery.",
      sentenceArabic: "فاز بمبلغ كبير of المال in اليانصيب.",
    },
    {
      english: "loyal",
      arabic: "وَفِيّ / مخلص",
      sentence: "Dogs are known for being loyal companions.",
      sentenceArabic: "الكلاب معروفة by كونها رفاق أوفياء.",
    },
    {
      english: "lyric",
      arabic: "كلمات أغنية",
      sentence: "I love the lyrics of this song.",
      sentenceArabic: "أحب كلمات هذه الأغنية.",
    },
    {
      english: "magnificent",
      arabic: "رائع / مهيب",
      sentence: "We saw a magnificent palace.",
      sentenceArabic: "رأينا قصرًا رائعًا.",
    },
    {
      english: "make-up",
      arabic: "ميكاب / مكياج",
      sentence: "She doesn't wear much make-up.",
      sentenceArabic: "هي لا تضع الكثير of المكياج.",
    },
    {
      english: "making",
      arabic: "صُنع / صناعة",
      sentence: "The making of the film took two years.",
      sentenceArabic: "استغرق صُنع الفيلم سنتين.",
    },
    {
      english: "manufacture",
      arabic: "يَصنع (بكميات كبيرة)",
      sentence: "The company manufactures electronic devices.",
      sentenceArabic: "تَصنع الشركة أجهزة إلكترونية.",
    },
    {
      english: "manufacturing",
      arabic: "صِناعة / تصنيع",
      sentence: "Manufacturing is a key sector of the economy.",
      sentenceArabic: "التصنيع قطاع رئيسي in الاقتصاد.",
    },
    {
      english: "marathon",
      arabic: "ماراثون",
      sentence: "She is training to run a marathon.",
      sentenceArabic: "هي تتدرب لـ run ماراثون.",
    },
    {
      english: "margin",
      arabic: "هامِش / حد",
      sentence: "He won the election by a narrow margin.",
      sentenceArabic: "فاز in الانتخابات by هامِش ضيق.",
    },
    {
      english: "marker",
      arabic: "قلم تَظليل / ماركر",
      sentence: "Use a red marker to highlight the important points.",
      sentenceArabic: "استخدم قلم تَظليل أحمر to إبراز النقاط المهمة.",
    },
    {
      english: "martial",
      arabic: "قَتالي / عسكري",
      sentence: "He practices martial arts.",
      sentenceArabic: "هو يمارس الفنون القَتالية.",
    },
    {
      english: "mate",
      arabic: "رَفيق / زميل",
      sentence: "He went to the pub with his mates.",
      sentenceArabic: "ذهب to الحانة with أصدقائه.",
    },
    {
      english: "mayor",
      arabic: "عُمْدة",
      sentence: "The mayor cut the ribbon at the opening ceremony.",
      sentenceArabic: "قطع العُمْدة الشريط in حفل الافتتاح.",
    },
    {
      english: "mechanic",
      arabic: "ميكانيكي",
      sentence: "The mechanic fixed my car.",
      sentenceArabic: "أصلح الميكانيكي سيارتي.",
    },
    {
      english: "mechanical",
      arabic: "ميكانيكي / آلي",
      sentence: "The watch has a mechanical movement.",
      sentenceArabic: "الساعة لها حركة ميكانيكية.",
    },
    {
      english: "mechanism",
      arabic: "آلية / تركيب",
      sentence: "Scientists understand the mechanism behind this process.",
      sentenceArabic: "يفهم العلماء الآلية behind هذه العملية.",
    },
    {
      english: "medal",
      arabic: "ميدالية",
      sentence: "The athlete won a gold medal.",
      sentenceArabic: "فاز الرياضي بميدالية ذهبية.",
    },
    {
      english: "medication",
      arabic: "دَواء / دواء",
      sentence: "He takes medication for his blood pressure.",
      sentenceArabic: "هو يتناول دَواء for ضغط الدم.",
    },
    {
      english: "membership",
      arabic: "عُضوية",
      sentence: "My gym membership expires next month.",
      sentenceArabic: "عُضوية النادي الرياضي تنتهي next month.",
    },
    {
      english: "memorable",
      arabic: "لا يُنسى / خالد",
      sentence: "It was a memorable experience.",
      sentenceArabic: "كانت تجربة لا تُنسى.",
    },
    {
      english: "metaphor",
      arabic: "اِستعارة",
      sentence: "The author uses metaphor beautifully.",
      sentenceArabic: "يستخدم الكاتب الاِستعارة beautifully.",
    },
    {
      english: "pride",
      arabic: "فَخْر / كبرياء",
      sentence: "She felt great pride after her achievement.",
      sentenceArabic: "شعرت بفَخْر كبير after إنجازها.",
    },
    {
      english: "primarily",
      arabic: "في المقام الأول / أساسًا",
      sentence: "The book is primarily aimed at children.",
      sentenceArabic: "الكتاب مُوجَّه في المقام الأول to الأطفال.",
    },
    {
      english: "prior",
      arabic: "سابِق / قبل",
      sentence: "You need prior experience for this job.",
      sentenceArabic: "أنت تحتاج to خبرة سابِقة for هذه الوظيفة.",
    },
    {
      english: "probability",
      arabic: "اِحتمال",
      sentence: "There's a high probability of rain tomorrow.",
      sentenceArabic: "هناك اِحتمال كبير لسقوط المطر tomorrow.",
    },
    {
      english: "probable",
      arabic: "مُحْتَمَل",
      sentence: "It is probable that the meeting will be postponed.",
      sentenceArabic: "من المُحْتَمَل that سيتم تأجيل الاجتماع.",
    },
    {
      english: "proceed",
      arabic: "يَتَقدّم / يستمر",
      sentence: "Please proceed to the next checkpoint.",
      sentenceArabic: "من فضلك، تَقدّم to نقطة التفتيش التالية.",
    },
    {
      english: "programming",
      arabic: "بَرْمجة",
      sentence: "Programming requires logical thinking.",
      sentenceArabic: "البَرْمجة تَتطلّب تفكيرًا منطقيًا.",
    },
    {
      english: "progressive",
      arabic: "تَقَدُّمي",
      sentence: "The country has made progressive reforms.",
      sentenceArabic: "أجرت الدولة إصلاحات تَقَدُّمية.",
    },
    {
      english: "prohibit",
      arabic: "يَمْنَع / يحظر",
      sentence: "Smoking is prohibited in this area.",
      sentenceArabic: "التدخين مَمْنوع in هذه المنطقة.",
    },
    {
      english: "promising",
      arabic: "واعد",
      sentence: "She is a promising young athlete.",
      sentenceArabic: "هي لاعبة واعدة.",
    },
    {
      english: "promotion",
      arabic: "ترقية / ترقية",
      sentence: "He got a promotion at work.",
      sentenceArabic: "حصل على ترقية in العمل.",
    },
    {
      english: "prompt",
      arabic: "سريع / فوري",
      sentence: "Thank you for your prompt reply.",
      sentenceArabic: "شكرًا لك on ردك السريع.",
    },
    {
      english: "proportion",
      arabic: "نِسبة / جزء",
      sentence: "A large proportion of the budget is spent on education.",
      sentenceArabic: "نِسبة كبيرة from الميزانية تُنفَق on التعليم.",
    },
    {
      english: "protein",
      arabic: "بْروتين",
      sentence: "Meat and beans are good sources of protein.",
      sentenceArabic: "اللحم والبقول مصادر جيدة for البْروتين.",
    },
    {
      english: "protester",
      arabic: "مُتَظاهِر",
      sentence: "The protesters gathered in the square.",
      sentenceArabic: "اجتمع المُتَظاهِرون in الساحة.",
    },
    {
      english: "psychological",
      arabic: "نَفْسي",
      sentence: "The victim suffered psychological trauma.",
      sentenceArabic: "عانى الضحية صدمة نَفْسية.",
    },
    {
      english: "publicity",
      arabic: "دَعاية / علاقات عامة",
      sentence: "The event received a lot of publicity.",
      sentenceArabic: "تَلَقَّى الحدث الكثير of الدَعاية.",
    },
    {
      english: "publishing",
      arabic: "نَشر",
      sentence: "She works in publishing.",
      sentenceArabic: "هي تعمل in مجال النَشر.",
    },
    {
      english: "slogan",
      arabic: "شِعار / slogan",
      sentence: "The advertising slogan was very catchy.",
      sentenceArabic: "كان الشِعار الدعائي جذابًا جدًا.",
    },
    {
      english: "so-called",
      arabic: "ما يُسمى /所谓的",
      sentence: "He is a so-called expert.",
      sentenceArabic: "هو what يُسمى خبير.",
    },
    {
      english: "somehow",
      arabic: "بِطريقة ما",
      sentence: "We'll get there somehow.",
      sentenceArabic: "سنصل to هناك بِطريقة ما.",
    },
    {
      english: "sometime",
      arabic: "في وقت ما",
      sentence: "Let's meet up sometime next week.",
      sentenceArabic: "لنتقابل في وقت ما next week.",
    },
    {
      english: "sophisticated",
      arabic: "مُتَطَوِّر / معقد",
      sentence: "They use sophisticated technology.",
      sentenceArabic: "هم يستخدمون technology مُتَطَوِّرة.",
    },
    {
      english: "specify",
      arabic: "يُحَدِّد",
      sentence: "Please specify your date of birth.",
      sentenceArabic: "من فضلك، حَدِّد تاريخ ميلادك.",
    },
    {
      english: "spectacular",
      arabic: "مُذهِل / رائع",
      sentence: "We watched a spectacular fireworks display.",
      sentenceArabic: "شاهدنا عرض ألعاب نارية مُذهِل.",
    },
    {
      english: "spectator",
      arabic: "مُشاهِد / متفرج",
      sentence: "Thousands of spectators watched the game.",
      sentenceArabic: "شاهد thousands of المُشاهِدين المباراة.",
    },
    {
      english: "speculate",
      arabic: "يَتَكَهَّن / يتوقع",
      sentence: "Journalists speculate about the reasons for his resignation.",
      sentenceArabic: "يَتَكَهَّن الصحفيون about أسباب استقالته.",
    },
    {
      english: "speculation",
      arabic: "تَكَهُّن",
      sentence: "There is much speculation about their relationship.",
      sentenceArabic: "هناك many تكهُّنات about علاقتهم.",
    },
    {
      english: "spice",
      arabic: "تابل / بهار",
      sentence: "This dish needs more spice.",
      sentenceArabic: "هذا الطبق يحتاج to المزيد of البهارات.",
    },
    {
      english: "spill",
      arabic: "يسكب / انسكاب",
      sentence: "I spilled coffee on my shirt.",
      sentenceArabic: "سكبت القهوة on قميصي.",
    },
    {
      english: "spite",
      arabic: "عَلى الرَّغْم من",
      sentence: "In spite of the rain, we went for a walk.",
      sentenceArabic: "عَلى الرَّغْم from المطر, ذهبنا for المشي.",
    },
    {
      english: "spoil",
      arabic: "يُفْسِد / يدلل",
      sentence: "Don't spoil your dinner with candy.",
      sentenceArabic: "لا تُفْسِد عشاءك by الحلوى.",
    },
    {
      english: "spokesman",
      arabic: "مُتَحدِّث رَسْمي",
      sentence: "A company spokesman made a statement.",
      sentenceArabic: "أصدر مُتَحدِّث رَسْمي for الشركة بيانًا.",
    },
    {
      english: "spokesperson",
      arabic: "مُتَحدِّث / ناطق",
      sentence: "The spokesperson answered journalists' questions.",
      sentenceArabic: "أجاب المُتَحدِّث on أسئلة الصحفيين.",
    },
    {
      english: "spokeswoman",
      arabic: "مُتَحدِّثة",
      sentence: "A spokeswoman for the ministry denied the reports.",
      sentenceArabic: "نَفَت مُتَحدِّثة for الوزارة الأخبار.",
    },
    {
      english: "sponsorship",
      arabic: "رِعاية",
      sentence: "The event needs corporate sponsorship.",
      sentenceArabic: "الحدث يحتاج to رِعاية شركات.",
    },
    {
      english: "sporting",
      arabic: "رِياضي",
      sentence: "It was a great sporting event.",
      sentenceArabic: "كان حدثًا رِياضيًا رائعًا.",
    },
    {
      english: "stall",
      arabic: "كُشك / كشك",
      sentence: "We bought souvenirs from a market stall.",
      sentenceArabic: "اشترينا تذكارات from كُشك in السوق.",
    },
    {
      english: "stance",
      arabic: "مَوقف",
      sentence: "The government's stance on the issue is clear.",
      sentenceArabic: "مَوقف الحكومة from القضية واضح.",
    },
    {
      english: "starve",
      arabic: "يَجوع / يجوع",
      sentence: "Millions of people are starving.",
      sentenceArabic: "ملايين of الناس يَجوعون.",
    },
    {
      english: "steadily",
      arabic: "بِانتظام / بثبات",
      sentence: "The company's profits have grown steadily.",
      sentenceArabic: "أرباح الشركة نمَت بِانتظام.",
    },
    {
      english: "steam",
      arabic: "بُخار",
      sentence: "Steam was rising from the cup of coffee.",
      sentenceArabic: "كان البُخار يتصاعد from فنجان القهوة.",
    },
    {
      english: "stimulate",
      arabic: "يُحَفِّز",
      sentence: "The government wants to stimulate the economy.",
      sentenceArabic: "تريد الحكومة أن تُحَفِّز الاقتصاد.",
    },
    {
      english: "variation",
      arabic: "اِختِلاف / تَبايُن",
      sentence: "There are many regional variations in pronunciation.",
      sentenceArabic: "هناك many اِختِلافات regional في النطق.",
    },
    {
      english: "vertical",
      arabic: "عَمودي",
      sentence: "Draw a vertical line on the paper.",
      sentenceArabic: "ارسم خطًا عَموديًا on الورقة.",
    },
    {
      english: "viewpoint",
      arabic: "نقطة نظر / رأي",
      sentence: "We need to consider everyone's viewpoint.",
      sentenceArabic: "نحتاج to أخذ everyone نقطة نظر in الاعتبار.",
    },
  ],
  C1: [
    {
      english: "flawed",
      arabic: "معيب",
      sentence: "The theory was fundamentally flawed.",
      sentenceArabic: "كانت النظرية معيبةً أساسيًا.",
    },
    {
      english: "flee",
      arabic: "يهرب",
      sentence: "Thousands were forced to flee the conflict zone.",
      sentenceArabic: "أُجبر الآلاف على الهرب من منطقة الصراع.",
    },
    {
      english: "fleet",
      arabic: "أسطول",
      sentence: "The company is modernizing its delivery fleet.",
      sentenceArabic: "تقوم الشركة بتحديث أسطول التوصيل التابع لها.",
    },
    {
      english: "flesh",
      arabic: "لحم",
      sentence: "The wound was deep, exposing the flesh beneath.",
      sentenceArabic: "كان الجرح عميقًا، كاشفًا اللحم تحته.",
    },
    {
      english: "flexibility",
      arabic: "مرونة",
      sentence:
        "This job offers a great degree of flexibility in working hours.",
      sentenceArabic: "توفر هذه الوظيفة درجة كبيرة من المرونة في ساعات العمل.",
    },
    {
      english: "flourish",
      arabic: "يزدهر",
      sentence: "Arts and culture tend to flourish in times of peace.",
      sentenceArabic: "تميل الفنون والثقافة إلى الازدهار في أوقات السلم.",
    },
    {
      english: "fluid",
      arabic: "سائل",
      sentence: "The situation is still fluid and could change rapidly.",
      sentenceArabic: "لا تزال الوضعية سائلة ويمكن أن تتغير بسرعة.",
    },
    {
      english: "footage",
      arabic: "لقطات",
      sentence:
        "The documentary included never-before-seen footage of the event.",
      sentenceArabic: "ضمّ الوثائقي لقطات لم تُرَ من قبل للحدث.",
    },
    {
      english: "foreigner",
      arabic: "أجنبي",
      sentence: "As a foreigner, he needed a visa to work in the country.",
      sentenceArabic: "كأجنبي، كان يحتاج إلى تأشيرة للعمل في البلاد.",
    },
    {
      english: "forge",
      arabic: "يزور / يصنع",
      sentence:
        "They managed to forge a strong alliance against the common threat.",
      sentenceArabic: "تمكنوا من صنع تحالف قوي ضد التهديد المشترك.",
    },
    {
      english: "parish",
      arabic: "أبرشية",
      sentence: "The local parish church is a center for community events.",
      sentenceArabic: "كنيسة الأبرشية المحلية هي مركز للفعاليات المجتمعية.",
    },
    {
      english: "parliamentary",
      arabic: "برلماني",
      sentence: "The parliamentary debate lasted for over ten hours.",
      sentenceArabic: "استمر النقاش البرلماني لأكثر من عشر ساعات.",
    },
    {
      english: "partial",
      arabic: "جزئي",
      sentence:
        "The government could only achieve a partial solution to the crisis.",
      sentenceArabic: "لم يتمكن الحكومة من تحقيق سوى حل جزئي للأزمة.",
    },
    {
      english: "partially",
      arabic: "جزئيًا",
      sentence: "The project was only partially completed by the deadline.",
      sentenceArabic: "تم إكمال المشروع جزئيًا فقط بحلول الموعد النهائي.",
    },
    {
      english: "passing",
      arabic: "مرور",
      sentence:
        "We note, in passing, that the author's earlier work was more influential.",
      sentenceArabic:
        "نلاحظ، أثناء المرور، أن عمل المؤلف السابق كان أكثر تأثيرًا.",
    },
    {
      english: "passive",
      arabic: "سلبي",
      sentence: "His passive attitude towards the problem frustrated everyone.",
      sentenceArabic: "أثار موقفه السلبي من المشكلة إحباط الجميع.",
    },
    {
      english: "pastor",
      arabic: "قسيس",
      sentence: "The pastor delivered a powerful sermon on forgiveness.",
      sentenceArabic: "ألقى القسيس موعظة قوية عن التسامح.",
    },
    {
      english: "patch",
      arabic: "رقعة / ترقيع",
      sentence: "The software update included a critical security patch.",
      sentenceArabic: "ضمّ تحديث البرنامج رقعة أمان حرجة.",
    },
    {
      english: "patent",
      arabic: "براءة اختراع",
      sentence: "The company filed a patent for its innovative new technology.",
      sentenceArabic: "قدمت الشركة براءة اختراع لتقنيتها الجديدة المبتكرة.",
    },
    {
      english: "pathway",
      arabic: "مسار",
      sentence: "The new agreement could provide a pathway to peace.",
      sentenceArabic: "يمكن أن يوفر الاتفاق الجديد مسارًا نحو السلام.",
    },
    {
      english: "patrol",
      arabic: "دورية",
      sentence: "Security forces increased their patrol along the border.",
      sentenceArabic: "عززت القوات الأمنية دوريتها على طول الحدود.",
    },
    {
      english: "patron",
      arabic: "راعي",
      sentence: "The artist found a wealthy patron to support his work.",
      sentenceArabic: "وجد الفنان راعيًا ثريًا لدعم عمله.",
    },
    {
      english: "peak",
      arabic: "ذروة",
      sentence: "Tourist numbers are expected to peak in August.",
      sentenceArabic: "من المتوقع أن تصل أعداد السياح إلى الذروة في أغسطس.",
    },
    {
      english: "peasant",
      arabic: "فلاح",
      sentence:
        "The novel depicts the harsh life of a peasant in the 19th century.",
      sentenceArabic: "تصور الرواية الحياة القاسية لفلاح في القرن التاسع عشر.",
    },
    {
      english: "peculiar",
      arabic: "غريب",
      sentence: "There was a peculiar smell coming from the laboratory.",
      sentenceArabic: "كانت هناك رائحة غريبة تأتي من المختبر.",
    },
    {
      english: "persist",
      arabic: "يصر / يستمر",
      sentence: "If the symptoms persist, you should consult a doctor.",
      sentenceArabic: "إذا استمرت الأعراض، يجب أن تستشير طبيبًا.",
    },
    {
      english: "persistent",
      arabic: "مستمر / عنيد",
      sentence: "Her persistent efforts finally led to a breakthrough.",
      sentenceArabic: "جهودها المستمرة أدت finalmente إلى اختراق.",
    },
    {
      english: "personnel",
      arabic: "موظفون",
      sentence: "All personnel must complete the safety training.",
      sentenceArabic: "يجب على جميع الموظفين إكمال التدريب على السلامة.",
    },
    {
      english: "petition",
      arabic: "عريضة",
      sentence:
        "A petition was launched to save the historic building from demolition.",
      sentenceArabic: "أُطلقت عريضة لإنقاذ المبنى التاريخي من الهدم.",
    },
    {
      english: "philosopher",
      arabic: "فيلسوف",
      sentence: "The ancient philosopher pondered the nature of reality.",
      sentenceArabic: "تأمل الفيلسوف القديم طبيعة الواقع.",
    },
    {
      english: "philosophical",
      arabic: "فلسفي",
      sentence: "He took a philosophical approach to his recent misfortunes.",
      sentenceArabic: "اتخذ نهجًا فلسفيًا تجاه مصائبه الحديثة.",
    },
    {
      english: "physician",
      arabic: "طبيب",
      sentence:
        "She is a renowned physician specializing in infectious diseases.",
      sentenceArabic: "هي طبيبة مشهورة تتخصص في الأمراض المعدية.",
    },
    {
      english: "pioneer",
      arabic: "رائد",
      sentence: "She was a pioneer in the field of genetic research.",
      sentenceArabic: "كانت رائدة في مجال البحث الجيني.",
    },
    {
      english: "pipeline",
      arabic: "خط أنابيب",
      sentence: "Several new projects are in the pipeline for next year.",
      sentenceArabic: "هناك عدة مشاريع جديدة في خط الأنابيب للعام المقبل.",
    },
    {
      english: "pirate",
      arabic: "قرصان",
      sentence: "Pirate radio stations broadcast without a license.",
      sentenceArabic: "محطات الراديو القرصانية تبث بدون ترخيص.",
    },
    {
      english: "pit",
      arabic: "حفرة",
      sentence: "They dug a deep pit to bury the waste.",
      sentenceArabic: "حفروا حفرة عميقة لدفن النفايات.",
    },
    {
      english: "plea",
      arabic: "طلب",
      sentence: "The defendant entered a plea of not guilty.",
      sentenceArabic: "قدّم المتهم طلبًا بعدم الإقبال بالذنب.",
    },
    {
      english: "plead",
      arabic: "يتوسل / يترافع",
      sentence: "He pleaded with them to give him a second chance.",
      sentenceArabic: "توسل إليهم ليمنحوه فرصة ثانية.",
    },
    {
      english: "pledge",
      arabic: "وعد",
      sentence: "The government made a pledge to reduce carbon emissions.",
      sentenceArabic: "قطعت الحكومة وعدًا بخفض انبعاثات الكربون.",
    },
    {
      english: "plug",
      arabic: "قابس",
      sentence: "Don't forget to plug the microphone into the amplifier.",
      sentenceArabic: "لا تنسى أن توصل القابس الميكروفون بالمضخم.",
    },
    {
      english: "plunge",
      arabic: "غوص",
      sentence: "The news caused the company's stock price to plunge.",
      sentenceArabic: "تسببت الأخبار في غوص سعر سهم الشركة.",
    },
    {
      english: "pole",
      arabic: "قطب",
      sentence: "Their opinions on the matter are at opposite poles.",
      sentenceArabic: "آراؤهم في هذه المسألة عند أقطاب مت oppositeة.",
    },
    {
      english: "poll",
      arabic: "استطلاع رأي",
      sentence: "A recent poll indicates a shift in public opinion.",
      sentenceArabic: "يشير استطلاع رأي حديث إلى تحول في الرأي العام.",
    },
    {
      english: "pond",
      arabic: "بركة",
      sentence: "The children were catching tadpoles in the pond.",
      sentenceArabic: "كان الأطفال يصطادون شراغيف في البركة.",
    },
    {
      english: "pop",
      arabic: "موسيقى البوب",
      sentence: "The balloon will pop if you push the pin into it.",
      sentenceArabic: "ستنفجر البالونة إذا دفعت الدبوس فيها.",
    },
    {
      english: "portfolio",
      arabic: "محفظة",
      sentence: "The artist presented her portfolio to the gallery owner.",
      sentenceArabic: "قدمت الفنانة محفظتها إلى owner المعرض.",
    },
    {
      english: "portray",
      arabic: "يصور",
      sentence: "The film portrays the struggles of immigrants.",
      sentenceArabic: "يصور الفيلم صراعات المهاجرين.",
    },
    {
      english: "postpone",
      arabic: "يؤجل",
      sentence: "The meeting has been postponed indefinitely.",
      sentenceArabic: "تم تأجيل الاجتماع indefinitely.",
    },
    {
      english: "post-war",
      arabic: "ما بعد الحرب",
      sentence:
        "The country underwent significant reconstruction in the post-war era.",
      sentenceArabic:
        "خضعت البلاد لإعادة بناء significant في era ما بعد الحرب.",
    },
    {
      english: "practitioner",
      arabic: "ممارس",
      sentence: "She is a respected practitioner of traditional medicine.",
      sentenceArabic: "هي ممارسة محترمة للطب التقليدي.",
    },
    {
      english: "preach",
      arabic: "يعظ",
      sentence:
        "He preached tolerance and understanding between different communities.",
      sentenceArabic: "وعظ بالتسامح والتفاهم بين المجتمعات المختلفة.",
    },
    {
      english: "precedent",
      arabic: "سابقة",
      sentence: "The court's decision set a dangerous precedent.",
      sentenceArabic: "حدد قرار المحكمة سابقة خطيرة.",
    },
    {
      english: "precision",
      arabic: "دقة",
      sentence: "The operation requires extreme precision.",
      sentenceArabic: "تتطلب العملية دقة extreme.",
    },
    {
      english: "predator",
      arabic: "مفترس",
      sentence: "The hawk is a skilled predator.",
      sentenceArabic: "الصقر هو مفترس ماهر.",
    },
    {
      english: "predecessor",
      arabic: "سلف",
      sentence: "The new model is significantly faster than its predecessor.",
      sentenceArabic: "الموديل الجديد أسرع significantly من سلفه.",
    },
    {
      english: "predominantly",
      arabic: "غالبًا",
      sentence: "The region is predominantly agricultural.",
      sentenceArabic: "الregion هي زراعية غالبًا.",
    },
    {
      english: "pregnancy",
      arabic: "حمل",
      sentence: "Regular exercise is beneficial during pregnancy.",
      sentenceArabic: "التمرين المنتظم beneficial أثناء الحمل.",
    },
    {
      english: "sacred",
      arabic: "مقدس",
      sentence: "The site is considered sacred by many indigenous people.",
      sentenceArabic: "يعتبر الموقع مقدسًا من قبل many من السكان الأصليين.",
    },
    {
      english: "sacrifice",
      arabic: "تضحية",
      sentence: "Parents often make great sacrifices for their children.",
      sentenceArabic: "غالبًا ما يقدم الآباء تضحيات great لأطفالهم.",
    },
    {
      english: "saint",
      arabic: "قديس",
      sentence: "The village church is dedicated to a local saint.",
      sentenceArabic: "كنيسة القرية مكرسة لقديس local.",
    },
    {
      english: "sake",
      arabic: "من أجل",
      sentence: "He chose to compromise for the sake of peace.",
      sentenceArabic: "اختار المساومة من أجل السلام.",
    },
    {
      english: "sanction",
      arabic: "عقوبة",
      sentence:
        "The international community imposed economic sanctions on the regime.",
      sentenceArabic: "فرض المجتمع الدولي عقوبات economic على النظام.",
    },
    {
      english: "say",
      arabic: "قول",
      sentence: "She didn't have much say in the final decision.",
      sentenceArabic: "لم يكن لديها much قول في القرار النهائي.",
    },
    {
      english: "scattered",
      arabic: "متناثر",
      sentence: "His books were scattered all over the floor.",
      sentenceArabic: "كانت كتبه متناثرة all over الأرضية.",
    },
    {
      english: "sceptical",
      arabic: "مرتاب",
      sentence: "Many scientists remain sceptical about the new claims.",
      sentenceArabic:
        "يبقى many scientists مرتابين regarding الادعاءات الجديدة.",
    },
    {
      english: "scope",
      arabic: "نطاق",
      sentence: "The full scope of the problem is not yet understood.",
      sentenceArabic: "النطاق الكامل للمشكلة ليس مفهومًا بعد.",
    },
    {
      english: "screw",
      arabic: "برغي",
      sentence:
        "You need to tighten this screw with a Phillips head screwdriver.",
      sentenceArabic: "تحتاج إلى tighten هذا البرغي with مفك براغي Phillips.",
    },
    {
      english: "scrutiny",
      arabic: "تدقيق",
      sentence: "The company's finances are under intense scrutiny.",
      sentenceArabic: "تمويلات الشركة under تدقيق intense.",
    },
    {
      english: "seal",
      arabic: "ختم",
      sentence: "The agreement was sealed with a handshake.",
      sentenceArabic: "تم ختم الاتفاقية with مصافحة.",
    },
    {
      english: "secular",
      arabic: "علماني",
      sentence: "It is a secular state with no official religion.",
      sentenceArabic: "إنها دولة علمانية بدون دين official.",
    },
    {
      english: "seemingly",
      arabic: "ظاهريًا",
      sentence: "He was seemingly unaware of the chaos he had caused.",
      sentenceArabic: "كان ظاهريًا unaware من الفوضى التي تسبب بها.",
    },
    {
      english: "segment",
      arabic: "قطاع",
      sentence: "They analyzed a specific segment of the population.",
      sentenceArabic: "حللوا قطاعًا specific من السكان.",
    },
    {
      english: "seize",
      arabic: "يستولي",
      sentence: "The army seized control of the capital.",
      sentenceArabic: "استولى الجيش على السيطرة على العاصمة.",
    },
    {
      english: "seldom",
      arabic: "نادرًا",
      sentence: "She seldom speaks about her personal life.",
      sentenceArabic: "هي نادرًا ما تتحدث عن حياتها الشخصية.",
    },
    {
      english: "selective",
      arabic: "انتقائي",
      sentence: "The journalist was accused of being selective with the facts.",
      sentenceArabic: "اتُهم الصحفي بأنه انتقائي with الحقائق.",
    },
    {
      english: "senator",
      arabic: "سيناتور",
      sentence: "The senator proposed a new bill on environmental protection.",
      sentenceArabic: "اقترح السيناتور bill جديدًا حول حماية البيئة.",
    },
    {
      english: "sensation",
      arabic: "إحساس",
      sentence: "A strange sensation ran down her spine.",
      sentenceArabic: "جري إحساس غريب down عمودها الفقري.",
    },
    {
      english: "sensitivity",
      arabic: "حساسية",
      sentence: "The issue is handled with great sensitivity.",
      sentenceArabic: "يتم التعامل مع القضية with حساسية great.",
    },
    {
      english: "sentiment",
      arabic: "شعور",
      sentence: "There is strong public sentiment against the proposal.",
      sentenceArabic: "هناك شعور عام strong ضد الاقتراح.",
    },
    {
      english: "separation",
      arabic: "انفصال",
      sentence: "The long separation was difficult for the family.",
      sentenceArabic: "كان الانفصال الطويل صعبًا على العائلة.",
    },
    {
      english: "serial",
      arabic: "متسلسل",
      sentence: "The police were hunting a serial offender.",
      sentenceArabic: "كانت الشرطة تطارد offender متسلسلاً.",
    },
    {
      english: "settlement",
      arabic: "تسوية",
      sentence: "The two parties reached an out-of-court settlement.",
      sentenceArabic: "وصل الطرفان إلى تسوية out-of-court.",
    },
    {
      english: "set-up",
      arabic: "ترتيب",
      sentence: "The entire set-up was designed to deceive them.",
      sentenceArabic: "كان الترتيب بأكمله مصممًا لخداعهم.",
    },
    {
      english: "sexuality",
      arabic: "جنسانية",
      sentence: "The course explores themes of identity and sexuality.",
      sentenceArabic: "تستكشف الدورة themes الهوية والجنسانية.",
    },
    {
      english: "shareholder",
      arabic: "مساهم",
      sentence: "Shareholders voted against the merger.",
      sentenceArabic: "صوّت المساهمون against الاندماج.",
    },
    {
      english: "shatter",
      arabic: "يحطم",
      sentence: "The news shattered his dreams of becoming a pilot.",
      sentenceArabic: "حطمت الأخبار أحلامه بأن يصبح طيارًا.",
    },
    {
      english: "shed",
      arabic: "يسلط",
      sentence: "The research sheds new light on the causes of the disease.",
      sentenceArabic: "يسلط البحث new light على causes المرض.",
    },
    {
      english: "sheer",
      arabic: "مطلق",
      sentence: "They succeeded through sheer determination.",
      sentenceArabic: "نجحوا through determination مطلق.",
    },
    {
      english: "shipping",
      arabic: "شحن",
      sentence: "The cost includes shipping and handling.",
      sentenceArabic: "التكلفة include الشحن والمعالجة.",
    },
    {
      english: "shoot",
      arabic: "يصور",
      sentence: "The film was shot on location in Morocco.",
      sentenceArabic: "تم تصوير الفيلم on location في المغرب.",
    },
    {
      english: "shrink",
      arabic: "ينكمش",
      sentence: "The economy is expected to shrink by 2% this year.",
      sentenceArabic: "من المتوقع أن تنكمش الاقتصاد by 2% هذا العام.",
    },
    {
      english: "shrug",
      arabic: "يهز كتفيه",
      sentence: "He just shrugged his shoulders when asked about the mistake.",
      sentenceArabic: "هز كتفيه only when سُئل عن الخطأ.",
    },
    {
      english: "sigh",
      arabic: "تنهد",
      sentence: "She sighed with relief upon hearing the good news.",
      sentenceArabic: "تنهدت with relief upon سماع الأخبار الجيدة.",
    },
    {
      english: "simulate",
      arabic: "يحاكي",
      sentence: "The software can simulate various weather conditions.",
      sentenceArabic: "يمكن للبرنامج محاكاة various ظروف الطقس.",
    },
    {
      english: "simulation",
      arabic: "محاكاة",
      sentence: "Pilots train for hours in flight simulations.",
      sentenceArabic: "يتدرب الطيارون لساعات في محاكاة الطيران.",
    },
    {
      english: "simultaneously",
      arabic: "في وقت واحد",
      sentence: "The two events occurred almost simultaneously.",
      sentenceArabic: "حدث الحدثان almost في وقت واحد.",
    },
    {
      english: "sin",
      arabic: "خطيئة",
      sentence: "In many religions, lying is considered a sin.",
      sentenceArabic: "في many ديانات، يعتبر الكذب خطيئة.",
    },
    {
      english: "situated",
      arabic: "واقع",
      sentence:
        "The hotel is beautifully situated on a cliff overlooking the sea.",
      sentenceArabic: "الفندق واقع beautifully على منحدر overlooking البحر.",
    },
    {
      english: "sketch",
      arabic: "رسم",
      sentence: "The artist made a quick sketch of the landscape.",
      sentenceArabic: "قام الفنان برسم quick للمشهد.",
    },
    {
      english: "skip",
      arabic: "يتخطى",
      sentence:
        "You can skip the introduction if you're already familiar with the topic.",
      sentenceArabic: "يمكنك تخطى المقدمة if كنت familiar بالفعل بالموضوع.",
    },
    {
      english: "slam",
      arabic: "يضرب",
      sentence: "He slammed the door shut in anger.",
      sentenceArabic: "ضرب الباب shut بغضب.",
    },
    {
      english: "slap",
      arabic: "صفعة",
      sentence: "She slapped him across the face for his rude remark.",
      sentenceArabic: "لطمته across الوجه for ملاحظته الوقحة.",
    },
    {
      english: "slash",
      arabic: "يخفض",
      sentence: "The company announced it would slash its workforce by 20%.",
      sentenceArabic: "أعلنت الشركة أنها ستخفض قوتها العاملة by 20%.",
    },
    {
      english: "willingness",
      arabic: "استعداد",
      sentence: "Her willingness to learn new skills impressed her employers.",
      sentenceArabic: "أثار استعدادها لتعلم مهارات جديدة إعجاب employersها.",
    },
    {
      english: "wipe",
      arabic: "يمسح",
      sentence: "Please wipe your feet on the mat before entering.",
      sentenceArabic: "من فضلك امسح قدميك on السجادة before الدخول.",
    },
    {
      english: "wit",
      arabic: "ذكاء",
      sentence: "She responded to the criticism with her characteristic wit.",
      sentenceArabic: "استجابت للنقد with ذكائها المميز.",
    },
    {
      english: "withdrawal",
      arabic: "انسحاب",
      sentence: "The sudden withdrawal of funding jeopardized the project.",
      sentenceArabic: "هدد الانسحاب المفاجئ للتمويل المشروع.",
    },
    {
      english: "workout",
      arabic: "تمرين",
      sentence: "He does a strenuous workout at the gym every morning.",
      sentenceArabic: "يقوم بتمرين strenuous في النادي every صباح.",
    },
    {
      english: "worship",
      arabic: "عبادة",
      sentence: "The temple is a place of worship for thousands of devotees.",
      sentenceArabic: "المعبد هو مكان عبادة for الآلاف من المصلين.",
    },
    {
      english: "worthwhile",
      arabic: "يستحق العناء",
      sentence:
        "It was a long journey, but seeing the ancient ruins made it worthwhile.",
      sentenceArabic: "كانت رحلة طويلة، but رؤية الآثار جعلتها تستحق العناء.",
    },
    {
      english: "worthy",
      arabic: "جدير",
      sentence: "The project is worthy of further investigation.",
      sentenceArabic: "المشروع جدير بمزيد من التحقيق.",
    },
    {
      english: "yell",
      arabic: "يصرخ",
      sentence: "The coach yelled instructions from the sidelines.",
      sentenceArabic: "صرخ المدرب instructions from الخطوط الجانبية.",
    },
    {
      english: "yield",
      arabic: "عائد",
      sentence: "The experiment yielded unexpected results.",
      sentenceArabic: "أعطت التجربة نتائج غير متوقعة.",
    },
    {
      english: "youngster",
      arabic: "شاب",
      sentence:
        "The program is designed for youngsters between 10 and 16 years old.",
      sentenceArabic: "صمم البرنامج for الشباب between 10 و 16 عامًا.",
    },
    {
      english: "assemble",
      arabic: "يجمع",
      sentence: "It took them two hours to assemble the furniture.",
      sentenceArabic: "أخذهم ساعتين لتجميع الأثاث.",
    },
    {
      english: "assembly",
      arabic: "تجمع",
      sentence: "The right to peaceful assembly is protected by law.",
      sentenceArabic: "الحق في التجمع السلمي محمي by القانون.",
    },
    {
      english: "assert",
      arabic: "يؤكد",
      sentence: "She asserted her authority from the very beginning.",
      sentenceArabic: "أكدت سلطتها from البداية very.",
    },
    {
      english: "assertion",
      arabic: "تأكيد",
      sentence: "His assertion that the earth is flat was met with ridicule.",
      sentenceArabic: "قوبل تأكيده بأن الأرض مسطحة with سخرية.",
    },
    {
      english: "assurance",
      arabic: "تأكيد",
      sentence:
        "He gave me his personal assurance that the work would be completed on time.",
      sentenceArabic: "أعطاني تأكيده الشخصي that العمل سيكتمل on الوقت.",
    },
    {
      english: "asylum",
      arabic: "لجوء",
      sentence:
        "They applied for political asylum upon arriving in the country.",
      sentenceArabic: "قدموا طلبًا للجوء السياسي upon الوصول إلى البلد.",
    },
    {
      english: "atrocity",
      arabic: "فظاعة",
      sentence: "The court was set up to investigate war atrocities.",
      sentenceArabic: "أُنشئت المحكمة للتحقيق في فظاعات الحرب.",
    },
    {
      english: "attain",
      arabic: "يحقق",
      sentence: "He attained the rank of colonel at a very young age.",
      sentenceArabic: "حقق رتبة عقيد at عمر very صغير.",
    },
    {
      english: "attendance",
      arabic: "حضور",
      sentence: "Attendance at the meeting was mandatory for all staff.",
      sentenceArabic: "كان الحضور في الاجتماع mandatory for جميع الموظفين.",
    },
    {
      english: "attorney",
      arabic: "محام",
      sentence:
        "You have the right to speak to an attorney before questioning.",
      sentenceArabic: "لديك الحق في التحدث إلى محام before الاستجواب.",
    },
    {
      english: "attribute",
      arabic: "ينسب",
      sentence: "She attributes her success to hard work and perseverance.",
      sentenceArabic: "تنسب نجاحها to العمل الجاد والمثابرة.",
    },
    {
      english: "audit",
      arabic: "مراجعة",
      sentence: "The company undergoes an external audit every year.",
      sentenceArabic: "تخضع الشركة لمراجعة external every عام.",
    },
    {
      english: "authentic",
      arabic: "أصلي",
      sentence: "They serve authentic Italian cuisine.",
      sentenceArabic: "يقدمون مطبخًا إيطاليًا أصليًا.",
    },
    {
      english: "authorize",
      arabic: "يأذن",
      sentence: "I am not authorized to discuss these details.",
      sentenceArabic: "لست مصرحًا لي بمناقشة these التفاصيل.",
    },
    {
      english: "auto",
      arabic: "سيارة",
      sentence: "The auto industry is facing significant challenges.",
      sentenceArabic: "تواجه industry السيارات تحديات significant.",
    },
    {
      english: "autonomy",
      arabic: "استقلالية",
      sentence:
        "The university has a high degree of autonomy from the government.",
      sentenceArabic: "تمتلك الجامعة درجة high من الاستقلالية from الحكومة.",
    },
    {
      english: "availability",
      arabic: "توفر",
      sentence: "The availability of clean water is a major concern.",
      sentenceArabic: "يعد توفر المياه النظيفة concernًا major.",
    },
    {
      english: "await",
      arabic: "ينتظر",
      sentence: "We anxiously await the test results.",
      sentenceArabic: "ننتظر بقلق نتائج الاختبار.",
    },
    {
      english: "backdrop",
      arabic: "خلفية",
      sentence:
        "The political turmoil formed the backdrop to the economic crisis.",
      sentenceArabic: "شكلت الاضطرابات السياسية الخلفية for الأزمة الاقتصادية.",
    },
    {
      english: "backing",
      arabic: "دعم",
      sentence: "The project has the full backing of the management.",
      sentenceArabic: "يحظى المشروع بدعم full من الإدارة.",
    },
    {
      english: "backup",
      arabic: "نسخة احتياطية",
      sentence: "Always keep a backup of your important files.",
      sentenceArabic: "احتفظ دائمًا بنسخة احتياطية of ملفاتك المهمة.",
    },
    {
      english: "bail",
      arabic: "كفالة",
      sentence: "He was released on bail pending further investigation.",
      sentenceArabic: "أُطلق سراحه بكفالة pending مزيد من التحقيق.",
    },
    {
      english: "ballot",
      arabic: "تصويت",
      sentence: "The issue will be decided by a secret ballot.",
      sentenceArabic: "سيتم تقرير القضية by تصويت سري.",
    },
    {
      english: "banner",
      arabic: "لافتة",
      sentence: "Protesters carried banners demanding change.",
      sentenceArabic: "حمل المتظاهرون لافتات demanding التغيير.",
    },
    {
      english: "bare",
      arabic: "عاري",
      sentence: "The walls were bare except for a single painting.",
      sentenceArabic: "كانت الجدران عارية except for لوحة single.",
    },
    {
      english: "barrel",
      arabic: "برميل",
      sentence: "The price of oil is often quoted per barrel.",
      sentenceArabic: "غالبًا ما يُذكر سعر النفط per برميل.",
    },
    {
      english: "bass1",
      arabic: "جهير",
      sentence: "The bass guitarist provided the rhythm for the band.",
      sentenceArabic: "وفر عازف الجيتار الجهير الإيقاع for الفرقة.",
    },
    {
      english: "bat",
      arabic: "خفاش",
      sentence: "Bats use echolocation to navigate in the dark.",
      sentenceArabic: "تستخدم الخفافيش تحديد الموقع بالصدى للتنقل in الظلام.",
    },
    {
      english: "battlefield",
      arabic: "ساحة معركة",
      sentence: "The ancient battlefield is now a peaceful meadow.",
      sentenceArabic: "ساحة المعركة القديمة هي now مرعى peaceful.",
    },
    {
      english: "bay",
      arabic: "خليج",
      sentence: "The ship anchored in the sheltered bay.",
      sentenceArabic: "رست السفينة in الخليج sheltered.",
    },
    {
      english: "beam",
      arabic: "شعاع",
      sentence: "A beam of light pierced through the darkness.",
      sentenceArabic: "اخترق شعاع من الضوء الظلام.",
    },
    {
      english: "beast",
      arabic: "وحش",
      sentence:
        "The legend tells of a fearsome beast that lived in the forest.",
      sentenceArabic: "تحكي الأسطورة عن وحش مخيف عاش in الغابة.",
    },
    {
      english: "behalf",
      arabic: "نيابة",
      sentence: "On behalf of the entire team, I would like to thank you.",
      sentenceArabic: "نيابة about الفريق بأكمله، أود أن أشكرك.",
    },
    {
      english: "beloved",
      arabic: "محبوب",
      sentence: "She returned to her beloved homeland after years abroad.",
      sentenceArabic: "عادت إلى وطنها المحبوب after سنوات في الخارج.",
    },
    {
      english: "bench",
      arabic: "مقعد",
      sentence: "He sat on a park bench reading the newspaper.",
      sentenceArabic: "جلس on مقعد في الحديقة يقرأ الجريدة.",
    },
    {
      english: "benchmark",
      arabic: "معيار",
      sentence: "This victory set a new benchmark for the team.",
      sentenceArabic: "حدد هذا الفوز معيارًا جديدًا for الفريق.",
    },
    {
      english: "beneath",
      arabic: "تحت",
      sentence: "Ancient ruins were discovered beneath the modern city.",
      sentenceArabic: "تم اكتشاف ruins قديمة under المدينة الحديثة.",
    },
    {
      english: "beneficiary",
      arabic: "مستفيد",
      sentence: "She was the main beneficiary of her uncle's will.",
      sentenceArabic: "كانت المستفيدة الرئيسية from وصية عمها.",
    },
    {
      english: "consultation",
      arabic: "استشارة",
      sentence: "The policy was drafted after extensive public consultation.",
      sentenceArabic: "تم صياغة السياسة after استشارة public extensive.",
    },
    {
      english: "contemplate",
      arabic: "يتأمل",
      sentence: "He sat quietly, contemplating his next move.",
      sentenceArabic: "جلس بهدوء، يتأمل خطوته التالية.",
    },
    {
      english: "contempt",
      arabic: "ازدراء",
      sentence: "She looked at him with utter contempt.",
      sentenceArabic: "نظرت إليه with ازدراء utter.",
    },
    {
      english: "contend",
      arabic: "يتنافس",
      sentence: "Several teams are contending for the championship title.",
      sentenceArabic: "تتنافس several فرق for لقب البطولة.",
    },
    {
      english: "contender",
      arabic: "منافس",
      sentence: "She is a strong contender for the gold medal.",
      sentenceArabic: "هي منافسة قوية for الميدالية الذهبية.",
    },
    {
      english: "content2",
      arabic: "محتويات",
      sentence: "The content of the speech was surprisingly radical.",
      sentenceArabic: "كانت محتويات الخطاب radical بشكل مثير للدهشة.",
    },
    {
      english: "contention",
      arabic: "نزاع",
      sentence:
        "The ownership of the land is a point of contention between the two families.",
      sentenceArabic: "ملكية الأرض هي point نزاع between العائلتين.",
    },
    {
      english: "continually",
      arabic: "باستمرار",
      sentence: "The rules are continually being updated.",
      sentenceArabic: "يتم تحديث القواعد باستمرار.",
    },
    {
      english: "contractor",
      arabic: "مقاول",
      sentence: "We hired an independent contractor to renovate the kitchen.",
      sentenceArabic: "وظفنا مقاولاً independent لتجديد المطبخ.",
    },
    {
      english: "contradiction",
      arabic: "تناقض",
      sentence:
        "There is a clear contradiction between his words and his actions.",
      sentenceArabic: "هناك تناقض clear between أقواله وأفعاله.",
    },
    {
      english: "contrary",
      arabic: "عكس",
      sentence: "Contrary to popular belief, the animals are not dangerous.",
      sentenceArabic: "عكس الاعتقاد الشائع، الحيوانات ليست خطيرة.",
    },
    {
      english: "contributor",
      arabic: "مساهم",
      sentence: "He is a regular contributor to several scientific journals.",
      sentenceArabic: "هو مساهم regular في several مجلات علمية.",
    },
    {
      english: "conversion",
      arabic: "تحويل",
      sentence:
        "The conversion of the building into apartments took two years.",
      sentenceArabic: "أخذ تحويل المبنى إلى شقق سنتين.",
    },
    {
      english: "convict",
      arabic: "يدين",
      sentence: "The jury convicted him on two counts of fraud.",
      sentenceArabic: "أدانه هيئة المحلفين on تهمتين by احتيال.",
    },
    {
      english: "conviction",
      arabic: "قناعة",
      sentence: "She spoke with deep conviction about human rights.",
      sentenceArabic: "تحدثت with قناعة deep about حقوق الإنسان.",
    },
    {
      english: "cooperate",
      arabic: "يتعاون",
      sentence:
        "The two companies agreed to cooperate on the development of new technology.",
      sentenceArabic: "وافقت الشركتان على التعاون on تطوير technology جديدة.",
    },
    {
      english: "cooperative",
      arabic: "تعاوني",
      sentence: "The children were very cooperative during the photo session.",
      sentenceArabic: "كان الأطفال تعاونيين very during جلسة التصوير.",
    },
    {
      english: "coordinate",
      arabic: "ينسق",
      sentence:
        "A special committee was formed to coordinate the relief efforts.",
      sentenceArabic: "تم تشكيل لجنة special لتنسيق جهود الإغاثة.",
    },
    {
      english: "coordination",
      arabic: "تنسيق",
      sentence:
        "The operation requires precise coordination between all units.",
      sentenceArabic: "تتطلب العملية تنسيقًا precise between جميع الوحدات.",
    },
    {
      english: "coordinator",
      arabic: "منسق",
      sentence: "She works as a project coordinator for a large NGO.",
      sentenceArabic: "تعمل كمنسقة مشروع for منظمة كبيرة غير حكومية.",
    },
    {
      english: "cop",
      arabic: "شرطي",
      sentence: "A cop on the beat noticed the broken window.",
      sentenceArabic: "لاحظ شرطي في الدور نافذة مكسورة.",
    },
    {
      english: "copper",
      arabic: "نحاس",
      sentence: "The statue was made of copper and turned green over time.",
      sentenceArabic:
        "كان التمثال مصنوعًا من النحاس وتحول إلى اللون الأخضر over الوقت.",
    },
    {
      english: "copyright",
      arabic: "حقوق النشر",
      sentence: "The material is protected by copyright.",
      sentenceArabic: "المادة محمية by حقوق النشر.",
    },
    {
      english: "correction",
      arabic: "تصحيح",
      sentence:
        "I would like to make a small correction to my previous statement.",
      sentenceArabic: "أود إجراء تصحيح small لبياني السابق.",
    },
    {
      english: "correlate",
      arabic: "يرتبط",
      sentence:
        "The study found that income levels correlate strongly with educational attainment.",
      sentenceArabic:
        "وجدت الدراسة that مستويات الدخل ترتبط strongly with التحصيل العلمي.",
    },
    {
      english: "correlation",
      arabic: "ارتباط",
      sentence: "There is a high correlation between smoking and lung disease.",
      sentenceArabic: "هناك ارتباط high between التدخين ومرض الرئة.",
    },
    {
      english: "correspond",
      arabic: "يتوافق",
      sentence:
        "The written description should correspond exactly to the image.",
      sentenceArabic: "يجب أن يتوافق الوصف المكتوب exactly with الصورة.",
    },
    {
      english: "correspondence",
      arabic: "مراسلات",
      sentence: "All correspondence should be addressed to the manager.",
      sentenceArabic: "يجب addressing جميع المراسلات to المدير.",
    },
    {
      english: "correspondent",
      arabic: "مراسل",
      sentence: "She is the foreign correspondent for a major news network.",
      sentenceArabic: "هي المراسلة foreign for شبكة أخبار major.",
    },
    {
      english: "corresponding",
      arabic: "مقابل",
      sentence:
        "Profits were up by 10% compared to the corresponding period last year.",
      sentenceArabic:
        "زادت الأرباح by 10% compared to الفترة المقابلة last عام.",
    },
    {
      english: "corrupt",
      arabic: "فاسد",
      sentence: "The corrupt official was accepting bribes.",
      sentenceArabic: "كان الموظف الفاسد يقبل رشاوى.",
    },
    {
      english: "corruption",
      arabic: "فساد",
      sentence: "The new government vowed to fight corruption.",
      sentenceArabic: "تعهدت الحكومة الجديدة بمحاربة الفساد.",
    },
    {
      english: "costly",
      arabic: "مكلف",
      sentence: "The mistake proved to be very costly for the company.",
      sentenceArabic: "أثبت الخطأ أنه مكلف very للشركة.",
    },
    {
      english: "councillor",
      arabic: "مستشار",
      sentence: "She was elected as a local councillor.",
      sentenceArabic: "تم انتخابها كمستشارة local.",
    },
    {
      english: "counselling",
      arabic: "إرشاد",
      sentence: "The university offers free counselling services to students.",
      sentenceArabic: "تقدم الجامعة خدمات إرشاد free للطلاب.",
    },
    {
      english: "counsellor",
      arabic: "مرشد",
      sentence: "He sought advice from a financial counsellor.",
      sentenceArabic: "سعى للحصول على advice from مرشد مالي.",
    },
    {
      english: "counter",
      arabic: "عداد",
      sentence: "The evidence counters his earlier claims.",
      sentenceArabic: "الأدلة تعارض ادعاءاته السابقة.",
    },
    {
      english: "counterpart",
      arabic: "نظير",
      sentence: "The minister met with his French counterpart in Paris.",
      sentenceArabic: "التقى الوزير بنظيره الفرنسي in باريس.",
    },
    {
      english: "countless",
      arabic: "لا يحصى",
      sentence: "She has helped countless people throughout her career.",
      sentenceArabic: "لقد ساعدت عددًا لا يحصى من الناس throughout مسيرتها.",
    },
    {
      english: "coup",
      arabic: "انقلاب",
      sentence: "The military coup overthrew the democratic government.",
      sentenceArabic: "أطاح الانقلاب العسكري بالحكومة الديمقراطية.",
    },
    {
      english: "courtesy",
      arabic: "لباقة",
      sentence: "He replied with his usual courtesy.",
      sentenceArabic: "رد بلباقته المعتادة.",
    },
    {
      english: "craft",
      arabic: "حرفة",
      sentence: "She learned the craft of pottery from her grandmother.",
      sentenceArabic: "تعلمت حرفة الفخار from جدتها.",
    },
    {
      english: "crawl",
      arabic: "زحف",
      sentence: "The baby started to crawl across the floor.",
      sentenceArabic: "بدأ الطفل الزحف across الأرضية.",
    },
    {
      english: "creator",
      arabic: "خالق",
      sentence: "He is the creator of a popular television series.",
      sentenceArabic: "هو خالق مسلسل تلفزيوني popular.",
    },
    {
      english: "credibility",
      arabic: "مصداقية",
      sentence: "The scandal damaged the politician's credibility.",
      sentenceArabic: "أضرت الفضيحة بمصداقية السياسي.",
    },
    {
      english: "credible",
      arabic: "موثوق",
      sentence: "They provided a credible explanation for the delay.",
      sentenceArabic: "قدموا تفسيرًا موثوقًا for التأخير.",
    },
    {
      english: "creep",
      arabic: "زحف",
      sentence: "A sense of dread crept over him as he entered the dark room.",
      sentenceArabic: "زحف feeling of رعب overه when دخل الغرفة المظلمة.",
    },
    {
      english: "critique",
      arabic: "نقد",
      sentence: "She wrote a detailed critique of the proposed policy.",
      sentenceArabic: "كتبت نقدًا detailed للسياسة المقترحة.",
    },
    {
      english: "crown",
      arabic: "تاج",
      sentence: "The crown prince is next in line to the throne.",
      sentenceArabic: "ولي العهد هو التالي in line للعرش.",
    },
    {
      english: "crude",
      arabic: "خام",
      sentence: "The price of crude oil fluctuates daily.",
      sentenceArabic: "يتقلب سعر النفط الخام daily.",
    },
    {
      english: "crush",
      arabic: "سحق",
      sentence: "The government moved quickly to crush the rebellion.",
      sentenceArabic: "تحركت الحكومة quickly لسحق التمرد.",
    },
    {
      english: "crystal",
      arabic: "بلورة",
      sentence: "The cave was filled with beautiful crystals.",
      sentenceArabic: "كانت المغارة filled with بلورات beautiful.",
    },
    {
      english: "entity",
      arabic: "كيان",
      sentence: "The company is a separate legal entity.",
      sentenceArabic: "الشركة هي كيان قانوني separate.",
    },
    {
      english: "epidemic",
      arabic: "وباء",
      sentence: "The government is struggling to contain the epidemic.",
      sentenceArabic: "تكافح الحكومة لاحتواء الوباء.",
    },
    {
      english: "equality",
      arabic: "مساواة",
      sentence: "They fought for equality and social justice.",
      sentenceArabic: "قاتلوا من أجل المساواة والعدالة الاجتماعية.",
    },
    {
      english: "equation",
      arabic: "معادلة",
      sentence: "We need to factor human error into the equation.",
      sentenceArabic: "نحتاج إلى factor الخطأ البشري in المعادلة.",
    },
    {
      english: "erect",
      arabic: "يشيد",
      sentence: "A monument was erected in memory of the fallen soldiers.",
      sentenceArabic: "تم تشيد نصب تذكاري in memory of الجنود fallen.",
    },
    {
      english: "escalate",
      arabic: "يتصاعد",
      sentence:
        "The protest escalated into a violent confrontation with the police.",
      sentenceArabic: "تصاعد الاحتجاج إلى مواجهة violent with الشرطة.",
    },
    {
      english: "essence",
      arabic: "جوهر",
      sentence: "In essence, the two proposals are very similar.",
      sentenceArabic: "في الجوهر، الاقتراحان similar very.",
    },
    {
      english: "establishment",
      arabic: "إنشاء",
      sentence:
        "The establishment of the new state was celebrated throughout the region.",
      sentenceArabic: "تم الاحتفال بإنشاء الدولة الجديدة throughout المنطقة.",
    },
    {
      english: "eternal",
      arabic: "أبدي",
      sentence: "They promised each other eternal love.",
      sentenceArabic: "وعدوا بعضهم البعض بحب أبدي.",
    },
    {
      english: "evacuate",
      arabic: "إخلاء",
      sentence:
        "Residents were forced to evacuate due to the approaching wildfire.",
      sentenceArabic: "أُجبر السكان on الإخلاء due to اقتراب حريق wildfire.",
    },
    {
      english: "evoke",
      arabic: "يستحضر",
      sentence: "The smell of the ocean evoked memories of her childhood.",
      sentenceArabic: "استحضر smell المحيط ذكريات about طفولتها.",
    },
    {
      english: "evolutionary",
      arabic: "تطوري",
      sentence: "The evolutionary biologist studied the adaptation of species.",
      sentenceArabic: "درس عالم الأحياء التطوري adaptation الأنواع.",
    },
    {
      english: "exaggerate",
      arabic: "يمبالغ",
      sentence: "He tends to exaggerate the difficulties involved.",
      sentenceArabic: "يميل إلى المبالغة in الصعوبات involved.",
    },
    {
      english: "excellence",
      arabic: "تميز",
      sentence: "The university is known for its academic excellence.",
      sentenceArabic: "الجامعة معروفة بتميزها الأكاديمي.",
    },
    {
      english: "exceptional",
      arabic: "استثنائي",
      sentence: "She showed exceptional talent from a very young age.",
      sentenceArabic: "أظهرت موهبة استثنائية from عمر very صغير.",
    },
    {
      english: "excess",
      arabic: "فائض",
      sentence: "The body converts excess calories into fat.",
      sentenceArabic: "يحول الجسم السعرات الحرارية الفائضة to دهون.",
    },
    {
      english: "exclusion",
      arabic: "إقصاء",
      sentence:
        "The exclusion of certain groups from the process is unacceptable.",
      sentenceArabic: "إقصاء groups معينة from العملية unacceptable.",
    },
    {
      english: "exclusive",
      arabic: "حصري",
      sentence:
        "The newspaper published an exclusive interview with the president.",
      sentenceArabic: "نشرت الجريدة مقابلة exclusive with الرئيس.",
    },
    {
      english: "exclusively",
      arabic: "حصريًا",
      sentence: "This area is exclusively for the use of residents.",
      sentenceArabic: "هذه المنطقة حصريًا for استخدام residents.",
    },
    {
      english: "execute",
      arabic: "ينفذ",
      sentence: "The plan was perfectly executed.",
      sentenceArabic: "تم تنفيذ الخطة perfectly.",
    },
    {
      english: "execution",
      arabic: "تنفيذ",
      sentence: "The execution of the project will take several months.",
      sentenceArabic: "سيأخذ تنفيذ المشروع several أشهر.",
    },
    {
      english: "exert",
      arabic: "يبذل",
      sentence: "You need to exert more effort if you want to succeed.",
      sentenceArabic: "تحتاج إلى بذل جهد more if أردت النجاح.",
    },
    {
      english: "exile",
      arabic: "منفى",
      sentence: "The political dissident lived in exile for twenty years.",
      sentenceArabic: "عاش المعارض السياسي in منفى for عشرين عامًا.",
    },
    {
      english: "exit",
      arabic: "مخرج",
      sentence: "Please use the emergency exit in case of fire.",
      sentenceArabic: "من فضلك استخدم المخرج emergency in case of حريق.",
    },
    {
      english: "expenditure",
      arabic: "إنفاق",
      sentence: "Public expenditure on health has increased significantly.",
      sentenceArabic: "زاد الإنفاق العام on الصحة significantly.",
    },
    {
      english: "experimental",
      arabic: "تجريبي",
      sentence: "The treatment is still in the experimental stage.",
      sentenceArabic: "لا يزال العلاج in المرحلة التجريبية.",
    },
    {
      english: "expire",
      arabic: "ينتهي",
      sentence: "My passport expires next month.",
      sentenceArabic: "ينتهي جواز سفري next شهر.",
    },
    {
      english: "explicit",
      arabic: "صريح",
      sentence: "The film contains explicit language and violence.",
      sentenceArabic: "يحتوي الفيلم على لغة صريحة وعنف.",
    },
    {
      english: "explicitly",
      arabic: "صراحة",
      sentence: "The rules explicitly forbid the use of mobile phones.",
      sentenceArabic: "ت forbid القواعد explicitly استخدام الهواتف المحمولة.",
    },
    {
      english: "exploitation",
      arabic: "استغلال",
      sentence:
        "The workers protested against the exploitation of cheap labor.",
      sentenceArabic: "احتج العمال against استغلال العمالة الرخيصة.",
    },
    {
      english: "explosive",
      arabic: "متفجر",
      sentence: "The report contained some explosive revelations.",
      sentenceArabic: "احتوى التقرير على some كشوفات explosive.",
    },
    {
      english: "extract",
      arabic: "يستخرج",
      sentence:
        "It is difficult to extract useful information from such a vague report.",
      sentenceArabic: "من الصعب استخراج معلومات useful from تقرير vague كهذا.",
    },
    {
      english: "extremist",
      arabic: "متطرف",
      sentence:
        "The government condemned the extremist views expressed by the group.",
      sentenceArabic: "أدانت الحكومة الآراء المتطرفة expressed by المجموعة.",
    },
    {
      english: "facilitate",
      arabic: "يسهل",
      sentence:
        "The new software is designed to facilitate communication between departments.",
      sentenceArabic: "صمم البرنامج الجديد لتسهيل التواصل between الأقسام.",
    },
    {
      english: "faction",
      arabic: "فصيل",
      sentence: "The party was divided into several rival factions.",
      sentenceArabic: "انقسم الحزب إلى several فصائل متنافسة.",
    },
    {
      english: "faculty",
      arabic: "كلية",
      sentence: "She is a member of the faculty of medicine.",
      sentenceArabic: "هي عضو في كلية الطب.",
    },
    {
      english: "fade",
      arabic: "يبهت",
      sentence: "The photograph had faded over time.",
      sentenceArabic: "كانت الصورة قد بهتت over الوقت.",
    },
    {
      english: "fairness",
      arabic: "إنصاف",
      sentence: "The judge is known for his fairness and integrity.",
      sentenceArabic: "القاضي معروف بإنصافه ونزاهته.",
    },
    {
      english: "inflict",
      arabic: "يلحق",
      sentence: "The storm inflicted severe damage on the coastal villages.",
      sentenceArabic: "ألحق العاصفة damage severe على القرى الساحلية.",
    },
    {
      english: "influential",
      arabic: "مؤثر",
      sentence: "He was a highly influential figure in the art world.",
      sentenceArabic: "كان شخصية مؤثرة highly in عالم الفن.",
    },
    {
      english: "inherent",
      arabic: "متأصل",
      sentence: "There are inherent risks in any surgical procedure.",
      sentenceArabic: "هناك مخاطر متأصلة in any إجراء جراحي.",
    },
    {
      english: "inhibit",
      arabic: "يكبح",
      sentence: "Fear can inhibit creativity and innovation.",
      sentenceArabic: "يمكن للخوف أن يكبح الإبداع والابتكار.",
    },
    {
      english: "initiate",
      arabic: "يبدأ",
      sentence: "The company will initiate a new training program next month.",
      sentenceArabic: "ستبدأ الشركة برنامج تدريب جديد next شهر.",
    },
    {
      english: "inject",
      arabic: "يحقن",
      sentence: "The government needs to inject more capital into the economy.",
      sentenceArabic: "تحتاج الحكومة إلى حقن capital more في الاقتصاد.",
    },
    {
      english: "injection",
      arabic: "حقنة",
      sentence: "The patient received an injection of antibiotics.",
      sentenceArabic: "تلقى المريض حقنة من المضادات الحيوية.",
    },
    {
      english: "injustice",
      arabic: "ظلم",
      sentence: "They fought against social injustice and discrimination.",
      sentenceArabic: "حاربوا الظلم الاجتماعي والتمييز.",
    },
    {
      english: "inmate",
      arabic: "سجين",
      sentence: "The prison houses over a thousand inmates.",
      sentenceArabic: "يسجن السجن over ألف سجين.",
    },
    {
      english: "insertion",
      arabic: "إدخال",
      sentence:
        "The insertion of the key clause changed the entire meaning of the contract.",
      sentenceArabic: "غيّر إدخال البند الرئيسي المعنى entire للعقد.",
    },
    {
      english: "insider",
      arabic: "من الداخل",
      sentence: "Insider trading is illegal.",
      sentenceArabic: "تداول من الداخل غير قانوني.",
    },
    {
      english: "inspect",
      arabic: "يفتّش",
      sentence: "Health officials will inspect the restaurant next week.",
      sentenceArabic: "سيفتّش مسؤولو الصحة المطعم next أسبوع.",
    },
    {
      english: "inspection",
      arabic: "تفتيش",
      sentence: "The vehicle failed its safety inspection.",
      sentenceArabic: "فشلت المركبة في تفتيش السلامة الخاص بها.",
    },
    {
      english: "inspiration",
      arabic: "إلهام",
      sentence: "She was a great inspiration to young artists.",
      sentenceArabic: "كانت مصدر إلهام great للفنانين الشباب.",
    },
    {
      english: "instinct",
      arabic: "غريزة",
      sentence: "His first instinct was to run away.",
      sentenceArabic: "كانت غريزته الأولى هي الهروب.",
    },
    {
      english: "institutional",
      arabic: "مؤسسي",
      sentence: "The report highlighted the need for institutional reform.",
      sentenceArabic: "سلط التقرير الضوء on الحاجة إلى إصلاح مؤسسي.",
    },
    {
      english: "instruct",
      arabic: "يُعلّم",
      sentence: "The manual instructs users on how to assemble the product.",
      sentenceArabic: "يُعلّم الدليل المستخدمين on كيفية تجميع المنتج.",
    },
    {
      english: "instrumental",
      arabic: "فعال",
      sentence: "She was instrumental in securing the peace agreement.",
      sentenceArabic: "كانت فعالة in تأمين اتفاقية السلام.",
    },
    {
      english: "insufficient",
      arabic: "غير كاف",
      sentence: "There is insufficient evidence to support this claim.",
      sentenceArabic: "هناك evidence غير كافٍ لدعم هذا الادعاء.",
    },
    {
      english: "insult",
      arabic: "إهانة",
      sentence: "His comments were taken as a grave insult.",
      sentenceArabic: "أُخذت تعليقاته كإهانة grave.",
    },
    {
      english: "intact",
      arabic: "سليم",
      sentence: "Fortunately, the ancient manuscript remained intact.",
      sentenceArabic: "لحسن الحظ، بقي المخطوط القديم سليمًا.",
    },
    {
      english: "intake",
      arabic: "استهلاك",
      sentence: "You should reduce your intake of sugary drinks.",
      sentenceArabic: "يجب أن تقلل استهلاكك from المشروبات السكرية.",
    },
    {
      english: "integral",
      arabic: "أساسي",
      sentence: "Teamwork is an integral part of our company culture.",
      sentenceArabic: "العمل الجماعي هو جزء أساسي from ثقافة شركتنا.",
    },
    {
      english: "integrated",
      arabic: "متكامل",
      sentence: "The new system is fully integrated with existing software.",
      sentenceArabic: "النظام الجديد متكامل fully with برامج existing.",
    },
    {
      english: "integration",
      arabic: "دمج",
      sentence:
        "The successful integration of immigrants benefits the whole society.",
      sentenceArabic: "يفيد الدمج الناجح للمهاجرين المجتمع whole.",
    },
    {
      english: "integrity",
      arabic: "نزاهة",
      sentence: "No one questioned his personal integrity.",
      sentenceArabic: "لم يشكك أحد في نزاهته الشخصية.",
    },
    {
      english: "intellectual",
      arabic: "فكري",
      sentence: "The book stimulated intense intellectual debate.",
      sentenceArabic: "حفز الكتاب نقاشًا فكريًا intense.",
    },
    {
      english: "intensify",
      arabic: "يشدد",
      sentence: "The government intensified its efforts to find a solution.",
      sentenceArabic: "شددت الحكومة جهودها to إيجاد حل.",
    },
    {
      english: "intensity",
      arabic: "شدة",
      sentence: "The intensity of the storm surprised everyone.",
      sentenceArabic: "فاجأت شدة العاصفة الجميع.",
    },
    {
      english: "intensive",
      arabic: "مكثف",
      sentence: "She took an intensive language course before moving abroad.",
      sentenceArabic: "أخذت دورة لغة مكثفة before الانتقال إلى الخارج.",
    },
    {
      english: "intent",
      arabic: "نية",
      sentence: "He was charged with intent to cause harm.",
      sentenceArabic: "تمت تهمته with نية التسبب في أذى.",
    },
    {
      english: "interactive",
      arabic: "تفاعلي",
      sentence: "The museum features many interactive exhibits for children.",
      sentenceArabic: "يضم المتحف many معارض تفاعلية for الأطفال.",
    },
    {
      english: "interface",
      arabic: "واجهة",
      sentence: "The software has a user-friendly interface.",
      sentenceArabic: "يتميز البرنامج بواجهة user-friendly.",
    },
    {
      english: "interfere",
      arabic: "يتدخل",
      sentence: "Please don't interfere while I'm working.",
      sentenceArabic: "من فضلك لا تتدخل while أنا أعمل.",
    },
    {
      english: "interference",
      arabic: "تدخل",
      sentence:
        "There was allegations of foreign interference in the election.",
      sentenceArabic: "كانت هناك ادعاءات about تدخل foreign في الانتخابات.",
    },
    {
      english: "interim",
      arabic: "مؤقت",
      sentence:
        "An interim government was established until elections could be held.",
      sentenceArabic: "أُقيمت حكومة مؤقتة until يمكن إجراء الانتخابات.",
    },
    {
      english: "interior",
      arabic: "داخلي",
      sentence: "The interior of the building was beautifully decorated.",
      sentenceArabic: "كان interior المبنى decorated beautifully.",
    },
    {
      english: "intermediate",
      arabic: "متوسط",
      sentence: "This course is designed for intermediate learners.",
      sentenceArabic: "صممت هذه الدورة for متعلمين متوسطي المستوى.",
    },
    {
      english: "intervene",
      arabic: "يتدخل",
      sentence: "The UN refused to intervene militarily in the conflict.",
      sentenceArabic: "رفضت الأمم المتحدة التدخل عسكريًا in الصراع.",
    },
    {
      english: "intervention",
      arabic: "تدخل",
      sentence:
        "Early intervention can prevent more serious problems later on.",
      sentenceArabic: "يمكن للتدخل المبكر أن يمنع مشاكل more serious لاحقًا.",
    },
    {
      english: "intimate",
      arabic: "حميم",
      sentence: "They shared an intimate conversation late into the night.",
      sentenceArabic: "تشاركوا محادثة حميمة late into الليل.",
    },
    {
      english: "intriguing",
      arabic: "مثير للاهتمام",
      sentence: "The archaeologists made an intriguing discovery.",
      sentenceArabic: "قام علماء الآثار باكتشاف مثير للاهتمام.",
    },
    {
      english: "investigator",
      arabic: "محقق",
      sentence: "The lead investigator presented the findings of the report.",
      sentenceArabic: "قدم المحقق الرئيسي findings التقرير.",
    },
    {
      english: "invisible",
      arabic: "غير مرئي",
      sentence: "The virus is invisible to the naked eye.",
      sentenceArabic: "الفيروس غير مرئي for العين المجردة.",
    },
    {
      english: "invoke",
      arabic: "يستدعي",
      sentence:
        "The president invoked his executive powers to bypass congress.",
      sentenceArabic: "استدعى الرئيس صلاحياته التنفيذية to bypass الكونغرس.",
    },
    {
      english: "involvement",
      arabic: "مشاركة",
      sentence: "His involvement in the scandal ruined his career.",
      sentenceArabic: "دمرت مشاركته in الفضيحة مسيرته.",
    },
    {
      english: "ironic",
      arabic: "ساخر",
      sentence: "It is ironic that the fire station burned down.",
      sentenceArabic: "من السخرية that محطة الإطفاء احترقت.",
    },
    {
      english: "ironically",
      arabic: "بسخرية",
      sentence:
        "Ironically, his attempt to help only made the situation worse.",
      sentenceArabic: "بسخرية، جعلت محاولته للمساعدة الوضع worse فقط.",
    },
    {
      english: "notable",
      arabic: "ملحوظ",
      sentence: "The city has several notable landmarks.",
      sentenceArabic: "تمتلك المدينة several معالم ملحوظة.",
    },
    {
      english: "notably",
      arabic: "لا سيما",
      sentence:
        "Several world leaders, notably from Europe, attended the summit.",
      sentenceArabic: "حضر القمة several قادة عالميين، لا سيما from أوروبا.",
    },
    {
      english: "notify",
      arabic: "يخطر",
      sentence: "You must notify the authorities of any change of address.",
      sentenceArabic: "يجب أن تخطر السلطات about any تغيير في العنوان.",
    },
    {
      english: "notorious",
      arabic: "سيء السمعة",
      sentence: "That area is notorious for its high crime rate.",
      sentenceArabic: "تلك المنطقة سيئة السمعة for معدل الجريمة high فيها.",
    },
    {
      english: "novel",
      arabic: "رواية",
      sentence: "They developed a novel approach to solving the problem.",
      sentenceArabic: "طوروا نهجًا novel لحل المشكلة.",
    },
    {
      english: "nursery",
      arabic: "حضانة",
      sentence: "The children spent the morning at the nursery.",
      sentenceArabic: "قضى الأطفال الصباح in الحضانة.",
    },
    {
      english: "objection",
      arabic: "اعتراض",
      sentence: "I have no objection to your proposal.",
      sentenceArabic: "ليس لدي اعتراض on اقتراحك.",
    },
    {
      english: "oblige",
      arabic: "يلزم",
      sentence: "The law obliges companies to provide safe working conditions.",
      sentenceArabic: "يلزم القانون الشركات to توفير ظروف عمل آمنة.",
    },
    {
      english: "obsess",
      arabic: "يهوس",
      sentence: "He became obsessed with finding the truth.",
      sentenceArabic: "أصبح مهووسًا with إيجاد الحقيقة.",
    },
    {
      english: "obsession",
      arabic: "هوس",
      sentence: "His obsession with detail sometimes slows down the project.",
      sentenceArabic: "هوسه with التفاصيل sometimes يبطئ المشروع.",
    },
    {
      english: "occasional",
      arabic: "عرضي",
      sentence: "She enjoys an occasional glass of wine with dinner.",
      sentenceArabic: "تستمتع بكوب عرضي of نبيذ with العشاء.",
    },
    {
      english: "occurrence",
      arabic: "حدث",
      sentence: "Earthquakes are a common occurrence in this region.",
      sentenceArabic: "تعد الزلازل حدثًا common in هذه المنطقة.",
    },
    {
      english: "odds",
      arabic: "احتمالات",
      sentence: "The odds of winning the lottery are extremely low.",
      sentenceArabic: "احتمالات الفوز باليانصيب low extremely.",
    },
    {
      english: "offering",
      arabic: "عرض",
      sentence:
        "The company's new product offering was well received by consumers.",
      sentenceArabic:
        "كان عرض المنتج الجديد للشركة received جيدًا by المستهلكين.",
    },
    {
      english: "offspring",
      arabic: "نسل",
      sentence: "The lioness protects her offspring fiercely.",
      sentenceArabic: "تحمي اللبوة نسلها fiercely.",
    },
    {
      english: "operational",
      arabic: "تشغيلي",
      sentence: "The new airport is now fully operational.",
      sentenceArabic: "المطار الجديد now operational fully.",
    },
    {
      english: "opt",
      arabic: "يختار",
      sentence: "Many students opt to study abroad for a year.",
      sentenceArabic: "يختار many طلاب الدراسة في الخارج for عام.",
    },
    {
      english: "optical",
      arabic: "بصري",
      sentence: "The device uses optical technology to read fingerprints.",
      sentenceArabic: "يستخدم الجهاز technology بصرية to قراءة البصمات.",
    },
    {
      english: "optimism",
      arabic: "تفاؤل",
      sentence: "There is growing optimism about the peace talks.",
      sentenceArabic: "هناك تفاؤل growing about محادثات السلام.",
    },
    {
      english: "oral",
      arabic: "شفوي",
      sentence: "The exam consists of a written and an oral part.",
      sentenceArabic: "يتكون الامتحان من جزء written وشفوي.",
    },
    {
      english: "organizational",
      arabic: "تنظيمي",
      sentence: "The project faced significant organizational challenges.",
      sentenceArabic: "واجه المشروع تحديات تنظيمية significant.",
    },
    {
      english: "orientation",
      arabic: "توجيه",
      sentence: "New employees undergo a two-day orientation program.",
      sentenceArabic: "يخضع الموظفون الجدد لبرنامج توجيه لمدة يومين.",
    },
    {
      english: "originate",
      arabic: "ينشأ",
      sentence: "The tradition is believed to originate in ancient rituals.",
      sentenceArabic: "يُعتقد that التقليد ينشأ in طقوس قديمة.",
    },
    {
      english: "outbreak",
      arabic: "تفشي",
      sentence: "The outbreak of war forced them to flee their home.",
      sentenceArabic: "أجبرهم تفشي الحرب on الهرب from منزلهم.",
    },
    {
      english: "outing",
      arabic: "نزهة",
      sentence: "The school organized an outing to the museum.",
      sentenceArabic: "نظمت المدرسة نزهة to المتحف.",
    },
    {
      english: "outlet",
      arabic: "منفذ",
      sentence: "Exercise is a good outlet for stress.",
      sentenceArabic: "يمثل التمرين منفذًا جيدًا for التوتر.",
    },
    {
      english: "outlook",
      arabic: "نظرة",
      sentence: "The economic outlook for the next year is positive.",
      sentenceArabic: "نظرة الاقتصاد for العام next إيجابية.",
    },
    {
      english: "outrage",
      arabic: "غضب",
      sentence: "The decision sparked outrage among human rights activists.",
      sentenceArabic: "أثار القرار غضبًا among نشطاء حقوق الإنسان.",
    },
    {
      english: "outsider",
      arabic: "غريب",
      sentence:
        "As an outsider, he found it difficult to understand the local customs.",
      sentenceArabic: "كغريب، وجد صعوبة in فهم العادات المحلية.",
    },
    {
      english: "overlook",
      arabic: "يتغاضى",
      sentence: "We cannot overlook the importance of this issue.",
      sentenceArabic: "لا يمكننا التغاضي about أهمية هذه القضية.",
    },
    {
      english: "overly",
      arabic: "بشكل مفرط",
      sentence: "She is overly cautious when it comes to taking risks.",
      sentenceArabic: "هي حذرة بشكل مفرط when يتعلق الأمر بتحمل المخاطر.",
    },
    {
      english: "oversee",
      arabic: "يشرف",
      sentence: "A committee was appointed to oversee the transition process.",
      sentenceArabic: "عُينت لجنة للإشراف on عملية الانتقال.",
    },
    {
      english: "overturn",
      arabic: " يقلب",
      sentence: "The court overturned the previous ruling.",
      sentenceArabic: "قلبت المحكمة الحكم السابق.",
    },
    {
      english: "overwhelm",
      arabic: "يغمر",
      sentence: "She was overwhelmed by the support she received.",
      sentenceArabic: "غمرها الدعم الذي receivedته.",
    },
    {
      english: "overwhelming",
      arabic: "ساحق",
      sentence: "There was overwhelming evidence against the defendant.",
      sentenceArabic: "كانت هناك evidence ساحقة against المتهم.",
    },
    {
      english: "pad",
      arabic: "وسادة",
      sentence: "She made notes on a writing pad.",
      sentenceArabic: "دونت ملاحظاتها on وسادة كتابة.",
    },
    {
      english: "parameter",
      arabic: "معيار",
      sentence:
        "The research must be conducted within the parameters set by the ethics committee.",
      sentenceArabic:
        "يجب إجراء البحث within المعايير التي حددتها لجنة الأخلاقيات.",
    },
    {
      english: "parental",
      arabic: "أبوي",
      sentence: "Parental guidance is recommended for this film.",
      sentenceArabic: "يُ recommended التوجيه الأبوي for هذا الفيلم.",
    },
    {
      english: "remainder",
      arabic: "الباقي",
      sentence: "He spent the remainder of his life in peace.",
      sentenceArabic: "قضى باقي حياته in سلام.",
    },
    {
      english: "remains",
      arabic: "بقايا",
      sentence: "Archaeologists discovered the remains of a Roman villa.",
      sentenceArabic: "اكتشف علماء الآثار بقايا فيلا رومانية.",
    },
    {
      english: "remedy",
      arabic: "علاج",
      sentence: "There is no simple remedy for this complex problem.",
      sentenceArabic: "لا يوجد علاج simple for هذه المشكلة المعقدة.",
    },
    {
      english: "reminder",
      arabic: "تذكير",
      sentence: "The letter served as a reminder that payment was due.",
      sentenceArabic: "عملت الرسالة كتذكير that كان الدفع مستحقًا.",
    },
    {
      english: "removal",
      arabic: "إزالة",
      sentence: "The removal of the statue caused much controversy.",
      sentenceArabic: "تسببت إزالة التمثال في much جدل.",
    },
    {
      english: "render",
      arabic: "يجعل",
      sentence: "The storm rendered the roads impassable.",
      sentenceArabic: "جعلت العاصفة الطرق غير سالكة.",
    },
    {
      english: "renew",
      arabic: "يجدد",
      sentence: "You need to renew your passport every ten years.",
      sentenceArabic: "تحتاج إلى تجديد جواز سفرك every عشر سنوات.",
    },
    {
      english: "renowned",
      arabic: "شهير",
      sentence: "He is a renowned expert in his field.",
      sentenceArabic: "هو خبير شهير in مجاله.",
    },
    {
      english: "rental",
      arabic: "إيجار",
      sentence: "The monthly rental for the apartment is quite high.",
      sentenceArabic: "إيجار الشقة الشهري high quite.",
    },
    {
      english: "replacement",
      arabic: "استبدال",
      sentence: "We need to find a replacement for the broken printer.",
      sentenceArabic: "نحتاج إلى إيجاد بديل for الطابعة المكسورة.",
    },
    {
      english: "reportedly",
      arabic: "يُقال",
      sentence: "The president is reportedly considering a new tax proposal.",
      sentenceArabic: "يُقال أن الرئيس يفكر in اقتراح ضريبي جديد.",
    },
    {
      english: "representation",
      arabic: "تمثيل",
      sentence: "The painting is a representation of a mythological scene.",
      sentenceArabic: "اللوحة هي تمثيل لمشهد mythology.",
    },
    {
      english: "reproduce",
      arabic: "يتكاثر",
      sentence: "The animals reproduce rapidly in favorable conditions.",
      sentenceArabic: "تتكاثر الحيوانات rapidly in ظروف favorable.",
    },
    {
      english: "reproduction",
      arabic: "تكاثر",
      sentence:
        "The study focused on the reproduction patterns of the species.",
      sentenceArabic: "ركزت الدراسة on أنماط التكاثر for النوع.",
    },
    {
      english: "republic",
      arabic: "جمهورية",
      sentence: "The country became a republic after abolishing the monarchy.",
      sentenceArabic: "أصبحت البلاد جمهورية after إلغاء الملكية.",
    },
    {
      english: "resemble",
      arabic: "يشبه",
      sentence: "The child closely resembles his father.",
      sentenceArabic: "يشبه الطفل والده closely.",
    },
    {
      english: "reside",
      arabic: "يقيم",
      sentence: "They reside in a small village in the mountains.",
      sentenceArabic: "يقيمون in قرية small in الجبال.",
    },
    {
      english: "residence",
      arabic: "مسكن",
      sentence: "The ambassador's residence is heavily guarded.",
      sentenceArabic: "مسكن السفير heavily guarded.",
    },
    {
      english: "residential",
      arabic: "سكني",
      sentence: "This is a quiet residential area.",
      sentenceArabic: "هذه منطقة سكنية هادئة.",
    },
    {
      english: "residue",
      arabic: "بقايا",
      sentence: "A sticky residue was left on the table.",
      sentenceArabic: "تُركت بقايا لزجة on الطاولة.",
    },
    {
      english: "resignation",
      arabic: "استقالة",
      sentence: "The minister announced his resignation yesterday.",
      sentenceArabic: "أعلن الوزير استقالته yesterday.",
    },
    {
      english: "resistance",
      arabic: "مقاومة",
      sentence:
        "The invaders met with fierce resistance from the local population.",
      sentenceArabic: "واجه الغزاة مقاومة fierce from السكان المحليين.",
    },
    {
      english: "respective",
      arabic: "خاص",
      sentence: "They returned to their respective homes after the meeting.",
      sentenceArabic: "عادوا إلى بيوتهم الخاصة after الاجتماع.",
    },
    {
      english: "respectively",
      arabic: "على التوالي",
      sentence: "John and Jane are 10 and 12 years old, respectively.",
      sentenceArabic: "يبلغ جون وجين 10 و 12 عامًا، على التوالي.",
    },
    {
      english: "restoration",
      arabic: "ترميم",
      sentence: "The restoration of the ancient castle took over a decade.",
      sentenceArabic: "أخذ ترميم القلعة القديمة over عقد.",
    },
    {
      english: "restraint",
      arabic: "كبح",
      sentence:
        "The police showed great restraint in dealing with the protesters.",
      sentenceArabic: "أظهرت الشرطة كبحًا great in التعامل with المتظاهرين.",
    },
    {
      english: "resume",
      arabic: "يستأنف",
      sentence: "Peace talks are expected to resume next month.",
      sentenceArabic: "من المتوقع أن تستأنف محادثات السلام next شهر.",
    },
    {
      english: "retreat",
      arabic: "تراجع",
      sentence: "The army was forced to retreat under heavy fire.",
      sentenceArabic: "أُجبر الجيش on التراجع under نيران heavy.",
    },
    {
      english: "retrieve",
      arabic: "يسترجع",
      sentence:
        "She managed to retrieve the lost data from the damaged hard drive.",
      sentenceArabic:
        "تمكنت من استرجاع البيانات المفقودة from القرص الصلب damaged.",
    },
    {
      english: "revelation",
      arabic: "كشف",
      sentence:
        "The biography contained several shocking revelations about his private life.",
      sentenceArabic:
        "احتوت السيرة الذاتية على several كشوفات shocking about حياته الخاصة.",
    },
    {
      english: "revenge",
      arabic: "انتقام",
      sentence: "He swore to take revenge on those who had wronged him.",
      sentenceArabic: "أقسم على الانتقام from أولئك الذين wrongedوه.",
    },
    {
      english: "reverse",
      arabic: "يعكس",
      sentence: "The government failed to reverse the economic decline.",
      sentenceArabic: "فشلت الحكومة في عكس الانخفاض الاقتصادي.",
    },
    {
      english: "revival",
      arabic: "إحياء",
      sentence: "There has been a revival of interest in traditional crafts.",
      sentenceArabic: "كان هناك إحياء for الاهتمام in الحرف التقليدية.",
    },
    {
      english: "revive",
      arabic: "ينعش",
      sentence: "They are trying to revive the local economy.",
      sentenceArabic: "يحاولون إنعاش الاقتصاد المحلي.",
    },
    {
      english: "revolutionary",
      arabic: "ثوري",
      sentence: "The invention was truly revolutionary.",
      sentenceArabic: "كان الاختراع ثوريًا truly.",
    },
    {
      english: "rhetoric",
      arabic: "بلاغة",
      sentence: "His speech was full of empty rhetoric.",
      sentenceArabic: "كان خطابه full of بلاغة empty.",
    },
    {
      english: "rifle",
      arabic: "بندقية",
      sentence: "The soldier cleaned his rifle meticulously.",
      sentenceArabic: "نظف الجندي بندقيته meticulously.",
    },
    {
      english: "riot",
      arabic: "شغب",
      sentence: "The announcement sparked riots in several cities.",
      sentenceArabic: "أثار الإعلان أعمال شغب in several مدن.",
    },
    {
      english: "rip",
      arabic: "يمزق",
      sentence: "He ripped the paper in half.",
      sentenceArabic: "مزق الورقة to نصفين.",
    },
    {
      english: "ritual",
      arabic: "طقوس",
      sentence: "The performance of the ritual is strictly regulated.",
      sentenceArabic: "أداء الطقوس regulated strictly.",
    },
    {
      english: "robust",
      arabic: "قوي",
      sentence: "The economy is surprisingly robust despite global challenges.",
      sentenceArabic: "الاقتصاد قوي surprisingly despite التحديات العالمية.",
    },
    {
      english: "rock",
      arabic: "صخرة",
      sentence: "The ship hit a rock and sank.",
      sentenceArabic: "اصطدمت السفينة بصخرة وغرق.",
    },
    {
      english: "rod",
      arabic: "قضيب",
      sentence: "The curtains hung from a metal rod.",
      sentenceArabic: "علقت الستائر from قضيب معدني.",
    },
    {
      english: "rotate",
      arabic: "يدور",
      sentence: "The Earth rotates on its axis.",
      sentenceArabic: "تدور الأرض on محورها.",
    },
    {
      english: "rotation",
      arabic: "دوران",
      sentence: "The rotation of the crops improves soil fertility.",
      sentenceArabic: "يحسن دوران المحاصيل خصوبة التربة.",
    },
    {
      english: "ruling",
      arabic: "حكم",
      sentence: "The court's ruling set an important legal precedent.",
      sentenceArabic: "حدد حكم المحكمة سابقة قانونية important.",
    },
    {
      english: "rumour",
      arabic: "إشاعة",
      sentence: "Rumours about his resignation began to circulate.",
      sentenceArabic: "بدأت الإشاعات about استقالته في الانتشار.",
    },
    {
      english: "sack",
      arabic: "يُفصل",
      sentence: "He was sacked for repeatedly being late to work.",
      sentenceArabic: "تم فصله for التأخر repeatedly إلى العمل.",
    },
    {
      english: "syndrome",
      arabic: "متلازمة",
      sentence: "The doctor diagnosed a rare genetic syndrome.",
      sentenceArabic: "شخص الطبيب متلازمة جينية rare.",
    },
    {
      english: "synthesis",
      arabic: "تخليق",
      sentence: "The book is a synthesis of his earlier ideas.",
      sentenceArabic: "الكتاب هو تخليق for أفكاره السابقة.",
    },
    {
      english: "systematic",
      arabic: "منهجي",
      sentence: "They conducted a systematic review of the literature.",
      sentenceArabic: "أجروا مراجعة منهجية for الأدبيات.",
    },
    {
      english: "tackle",
      arabic: "يعالج",
      sentence: "The government must tackle the issue of poverty.",
      sentenceArabic: "يجب على الحكومة معالجة قضية الفقر.",
    },
    {
      english: "tactic",
      arabic: "تكتيك",
      sentence: "Their delaying tactic failed to stop the legislation.",
      sentenceArabic: "فشل تكتيكهم المتماطل in منع التشريع.",
    },
    {
      english: "tactical",
      arabic: "تكتيكي",
      sentence:
        "The general made a tactical withdrawal to a stronger position.",
      sentenceArabic: "قام الجنرال بانسحاب تكتيكي to موقع stronger.",
    },
    {
      english: "taxpayer",
      arabic: "دافع الضرائب",
      sentence: "The project will be funded by taxpayer money.",
      sentenceArabic: "سيتم تمويل المشروع by أموال دافعي الضرائب.",
    },
    {
      english: "tempt",
      arabic: "يجذب",
      sentence: "The offer was designed to tempt investors.",
      sentenceArabic: "صُمم العرض لجذب المستثمرين.",
    },
    {
      english: "tenant",
      arabic: "مستأجر",
      sentence: "The tenant is responsible for minor repairs.",
      sentenceArabic: "المستأجر مسؤول about الإصلاحات minor.",
    },
    {
      english: "tender",
      arabic: "عطاء",
      sentence:
        "Companies were invited to submit a tender for the construction project.",
      sentenceArabic: "دُعيت الشركات to تقديم عطاء for مشروع البناء.",
    },
    {
      english: "tenure",
      arabic: "عهدة",
      sentence:
        "During his tenure as director, he implemented significant reforms.",
      sentenceArabic: "during عهدته as مدير، نفذ إصلاحات significant.",
    },
    {
      english: "terminate",
      arabic: "يُنهي",
      sentence: "His contract was terminated due to misconduct.",
      sentenceArabic: "تم إنهاء عقده due to سوء السلوك.",
    },
    {
      english: "terrain",
      arabic: "تضاريس",
      sentence: "The rough terrain made it difficult to advance.",
      sentenceArabic: "جعلت التضاريس الوعرة التقدم صعبًا.",
    },
    {
      english: "terrific",
      arabic: "رائع",
      sentence: "We had a terrific time at the party.",
      sentenceArabic: "قضينا وقتًا رائعًا in الحفلة.",
    },
    {
      english: "testify",
      arabic: "يشهد",
      sentence: "The witness agreed to testify in court.",
      sentenceArabic: "وافق الشاهد على الشهادة in المحكمة.",
    },
    {
      english: "testimony",
      arabic: "شهادة",
      sentence: "His testimony was crucial for the conviction.",
      sentenceArabic: "كانت شهادته crucial for الإدانة.",
    },
    {
      english: "texture",
      arabic: "ملمس",
      sentence: "The fabric has a smooth texture.",
      sentenceArabic: "يتميز القماش بملمس ناعم.",
    },
    {
      english: "thankfully",
      arabic: "لحسن الحظ",
      sentence: "Thankfully, no one was injured in the accident.",
      sentenceArabic: "لحسن الحظ، لم يصب أحد in الحادث.",
    },
    {
      english: "theatrical",
      arabic: "مسرحي",
      sentence: "She made a theatrical gesture of despair.",
      sentenceArabic: "أدت إيماءة مسرحية of اليأس.",
    },
    {
      english: "theology",
      arabic: "لاهوت",
      sentence: "He is studying theology at the university.",
      sentenceArabic: "يدرس اللاهوت in الجامعة.",
    },
    {
      english: "theoretical",
      arabic: "نظري",
      sentence:
        "His argument is purely theoretical and lacks practical application.",
      sentenceArabic: "حجته نظرية purely وتفتقر إلى تطبيق عملي.",
    },
    {
      english: "thereafter",
      arabic: "بعد ذلك",
      sentence: "He graduated in 1990 and thereafter worked in industry.",
      sentenceArabic: "تخرج في 1990 and بعد ذلك worked in industry.",
    },
    {
      english: "thereby",
      arabic: "وبالتالي",
      sentence: "He passed the exam, thereby qualifying for the next level.",
      sentenceArabic: "اجتاز الامتحان، وبالتالي تأهل for المستوى next.",
    },
    {
      english: "thoughtful",
      arabic: "وقور",
      sentence: "It was very thoughtful of you to remember my birthday.",
      sentenceArabic: "كان وقورًا very منك تذكر عيد ميلادي.",
    },
    {
      english: "thought-provoking",
      arabic: "يُثير التفكير",
      sentence:
        "The film raises thought-provoking questions about artificial intelligence.",
      sentenceArabic: "يثير الفيلم أسئلة تثير التفكير about الذكاء الاصطناعي.",
    },
    {
      english: "thread",
      arabic: "خيط",
      sentence: "A common thread runs through all her novels.",
      sentenceArabic: "خيط common runs through جميع رواياتها.",
    },
    {
      english: "threshold",
      arabic: "عتبة",
      sentence: "The noise level was just below the pain threshold.",
      sentenceArabic: "كان مستوى الضوضاء below عتبة الألم just.",
    },
    {
      english: "thrilled",
      arabic: "مسرور",
      sentence: "She was thrilled to receive the award.",
      sentenceArabic: "كانت مسرورة to receive الجائزة.",
    },
    {
      english: "thrive",
      arabic: "يزدهر",
      sentence: "Some plants thrive in shady conditions.",
      sentenceArabic: "بعض النباتات تزدهر in ظروف shady.",
    },
    {
      english: "tide",
      arabic: "مد",
      sentence: "The tide was coming in, covering the beach.",
      sentenceArabic: "كان المد coming in، covering الشاطئ.",
    },
    {
      english: "tighten",
      arabic: "يشدد",
      sentence: "The government decided to tighten security measures.",
      sentenceArabic: "قررت الحكومة تشديد إجراءات الأمن.",
    },
    {
      english: "timber",
      arabic: "خشب",
      sentence: "The house was built from locally sourced timber.",
      sentenceArabic: "بُني المنزل from خشب مُورّد locally.",
    },
    {
      english: "timely",
      arabic: "في الوقت المناسب",
      sentence: "His timely intervention prevented a disaster.",
      sentenceArabic: "منع تدخله في الوقت المناسب كارثة.",
    },
    {
      english: "tobacco",
      arabic: "تبغ",
      sentence: "The government imposed a tax on tobacco products.",
      sentenceArabic: "فرضت الحكومة ضريبة on منتجات التبغ.",
    },
    {
      english: "tolerance",
      arabic: "تسامح",
      sentence: "Religious tolerance is essential for a peaceful society.",
      sentenceArabic: "التسامح الديني essential for مجتمع peaceful.",
    },
    {
      english: "tolerate",
      arabic: "يتسامح",
      sentence: "The school does not tolerate bullying of any kind.",
      sentenceArabic: "لا تتسامح المدرسة with تنمر of any نوع.",
    },
    {
      english: "toll",
      arabic: "حصيلة",
      sentence: "The earthquake took a heavy toll on the population.",
      sentenceArabic: "أخذ الزلزال حصيلة heavy on السكان.",
    },
    {
      english: "top",
      arabic: "قمة",
      sentence: "She reached the top of her profession at a young age.",
      sentenceArabic: "وصلت إلى قمة مهنتها at عمر young.",
    },
    {
      english: "torture",
      arabic: "تعذيب",
      sentence: "The use of torture is prohibited under international law.",
      sentenceArabic: "محظور استخدام التعذيب under القانون الدولي.",
    },
    {
      english: "toss",
      arabic: "يقذف",
      sentence: "He tossed the ball to his friend.",
      sentenceArabic: "قذف الكرة to صديقه.",
    },
    {
      english: "total",
      arabic: "إجمالي",
      sentence: "The total cost amounted to several million dollars.",
      sentenceArabic: "بلغت التكلفة الإجمالية several مليون دولار.",
    },
    {
      english: "weaken",
      arabic: "يضعف",
      sentence: "The illness weakened his immune system.",
      sentenceArabic: "أضعف المرض نظامه المناعي.",
    },
    {
      english: "weave",
      arabic: "يحيك",
      sentence: "The artist weaves traditional motifs into her tapestries.",
      sentenceArabic: "تحيك الفنانة motifs تقليدية in نسيجها.",
    },
    {
      english: "weed",
      arabic: "عشبة ضارة",
      sentence: "The garden is full of weeds.",
      sentenceArabic: "الحديقة full of أعشاب ضارة.",
    },
    {
      english: "well",
      arabic: "بئر",
      sentence: "They get their water from a well in the village.",
      sentenceArabic: "يحصلون على مائهم from بئر in القرية.",
    },
    {
      english: "well-being",
      arabic: "رفاهية",
      sentence: "Exercise contributes to your overall well-being.",
      sentenceArabic: "يساهم التمرين in رفاهيتك overall.",
    },
    {
      english: "whatsoever",
      arabic: "على الإطلاق",
      sentence: "There is no evidence whatsoever to support that theory.",
      sentenceArabic: "لا يوجد evidence على الإطلاق لدعم تلك النظرية.",
    },
    {
      english: "whereby",
      arabic: "حيث",
      sentence:
        "They devised a system whereby everyone could contribute ideas.",
      sentenceArabic: "ابتكروا نظامًا where يمكن للجميع contributing الأفكار.",
    },
    {
      english: "whilst",
      arabic: "بينما",
      sentence: "He fell asleep whilst reading the book.",
      sentenceArabic: "غلبته النوم while كان يقرأ الكتاب.",
    },
    {
      english: "whip",
      arabic: "سوط",
      sentence: "The rider cracked his whip.",
      sentenceArabic: "طقطق الراكب سوطه.",
    },
    {
      english: "wholly",
      arabic: "كليًا",
      sentence: "I am wholly responsible for the error.",
      sentenceArabic: "أنا مسؤول كليًا about الخطأ.",
    },
    {
      english: "widen",
      arabic: "يوسع",
      sentence: "The government plans to widen the highway.",
      sentenceArabic: "تخطط الحكومة لتوسيع الطريق السريع.",
    },
    {
      english: "widow",
      arabic: "أرملة",
      sentence: "The war left many widows and orphans.",
      sentenceArabic: "ترك الحرب many أرامل وأيتام.",
    },
    {
      english: "width",
      arabic: "عرض",
      sentence: "Please measure the length and width of the room.",
      sentenceArabic: "من فضلك قس الطول والعرض of الغرفة.",
    },
    {
      english: "albeit",
      arabic: "وإن كان",
      sentence: "The plan was successful, albeit expensive.",
      sentenceArabic: "كانت الخطة ناجحة، وإن كانت expensive.",
    },
    {
      english: "alert",
      arabic: "تنبيه",
      sentence: "Security was on high alert after the threat.",
      sentenceArabic: "كان الأمن في حالة تأهب high after التهديد.",
    },
    {
      english: "alien",
      arabic: "غريب",
      sentence: "The concept was utterly alien to him.",
      sentenceArabic: "كان المفهوم غريبًا utterly عنه.",
    },
    {
      english: "align",
      arabic: "يحاذي",
      sentence: "We need to align our goals with the company's strategy.",
      sentenceArabic: "نحتاج إلى محاذاة أهدافنا with إستراتيجية الشركة.",
    },
    {
      english: "alignment",
      arabic: "محاذاة",
      sentence: "The wheels need to be in perfect alignment.",
      sentenceArabic: "يجب أن تكون العجلات in محاذاة perfect.",
    },
    {
      english: "alike",
      arabic: "على حد سواء",
      sentence: "The twins look very much alike.",
      sentenceArabic: "يبدو التوأمان متشابهين very much.",
    },
    {
      english: "allegation",
      arabic: "ادعاء",
      sentence: "He denied the allegations of corruption.",
      sentenceArabic: "أنكر ادعاءات الفساد.",
    },
    {
      english: "allege",
      arabic: "يدعي",
      sentence: "The report alleges that officials accepted bribes.",
      sentenceArabic: "يدعي التقرير that قبل المسؤولون رشاوى.",
    },
    {
      english: "allegedly",
      arabic: "زعموا",
      sentence: "He was allegedly involved in the planning of the attack.",
      sentenceArabic: "كان involved allegedly in تخطيط الهجوم.",
    },
    {
      english: "alliance",
      arabic: "تحالف",
      sentence: "The two parties formed an alliance to win the election.",
      sentenceArabic: "شكل الحزبان تحالفًا to الفوز بالانتخابات.",
    },
    {
      english: "allocate",
      arabic: "يخصص",
      sentence: "Funds were allocated for the new school.",
      sentenceArabic: "تم تخصيص أموال for المدرسة الجديدة.",
    },
    {
      english: "allocation",
      arabic: "تخصيص",
      sentence: "The allocation of resources must be fair.",
      sentenceArabic: "يجب أن يكون تخصيص الموارد fair.",
    },
    {
      english: "allowance",
      arabic: "بدل",
      sentence: "Children receive a weekly allowance from their parents.",
      sentenceArabic: "يتلقى الأطفال بدلاً أسبوعيًا from آبائهم.",
    },
    {
      english: "ally",
      arabic: "حليف",
      sentence: "The country is a close ally of the United States.",
      sentenceArabic: "البلاد هي حليف close للولايات المتحدة.",
    },
    {
      english: "aluminium",
      arabic: "ألومنيوم",
      sentence: "The frame is made of lightweight aluminium.",
      sentenceArabic: "الإطار مصنوع من ألومنيوم lightweight.",
    },
    {
      english: "amateur",
      arabic: "هواة",
      sentence: "He is an amateur photographer.",
      sentenceArabic: "هو مصور هواة.",
    },
    {
      english: "ambassador",
      arabic: "سفير",
      sentence: "The ambassador presented his credentials to the president.",
      sentenceArabic: "قدم السفير أوراق اعتماده to الرئيس.",
    },
    {
      english: "amend",
      arabic: "يعدل",
      sentence: "The law was amended to include stricter penalties.",
      sentenceArabic: "عُدل القانون to تضمين عقوبات stricter.",
    },
    {
      english: "amendment",
      arabic: "تعديل",
      sentence:
        "The first amendment to the US Constitution guarantees free speech.",
      sentenceArabic: "يضمن التعديل الأول for الدستور الأمريكي حرية التعبير.",
    },
    {
      english: "amid",
      arabic: "وسط",
      sentence: "The peace talks took place amid rising tensions.",
      sentenceArabic: "جرت محادثات السلام amid توترات rising.",
    },
    {
      english: "analogy",
      arabic: "تشبيه",
      sentence: "He used an analogy to explain the complex scientific concept.",
      sentenceArabic: "استخدم تشبيهًا to شرح المفهوم العلمي المعقد.",
    },
    {
      english: "anchor",
      arabic: "مرساة",
      sentence: "The ship dropped anchor in the bay.",
      sentenceArabic: "أسقطت السفينة مرساتها in الخليج.",
    },
    {
      english: "angel",
      arabic: "ملاك",
      sentence: "She painted an angel on the ceiling.",
      sentenceArabic: "رسمت ملاكًا on السقف.",
    },
    {
      english: "anonymous",
      arabic: "مجهول",
      sentence: "The donation was made by an anonymous benefactor.",
      sentenceArabic: "تم التبرع by متبرع مجهول.",
    },
    {
      english: "apparatus",
      arabic: "جهاز",
      sentence: "The laboratory is equipped with the latest apparatus.",
      sentenceArabic: "المختبر مجهز with أحدث الأجهزة.",
    },
    {
      english: "appealing",
      arabic: "جذاب",
      sentence: "The idea of a holiday in the sun is very appealing.",
      sentenceArabic: "فكرة عطلة in الشمس جذابة very.",
    },
    {
      english: "appetite",
      arabic: "شهية",
      sentence: "The walk gave me an appetite for lunch.",
      sentenceArabic: "أعطاني المشي شهية for الغداء.",
    },
    {
      english: "applaud",
      arabic: "يصفق",
      sentence:
        "The audience applauded enthusiastically at the end of the performance.",
      sentenceArabic: "صفق الجمهور enthusiastically at نهاية الأداء.",
    },
    {
      english: "applicable",
      arabic: " قابل للتطبيق",
      sentence: "These rules are not applicable in this situation.",
      sentenceArabic: "هذه القواعد غير قابلة للتطبيق in هذه الوضعية.",
    },
    {
      english: "appoint",
      arabic: "يعين",
      sentence: "She was appointed as the new director.",
      sentenceArabic: "تم تعيينها as المديرة الجديدة.",
    },
    {
      english: "appreciation",
      arabic: "تقدير",
      sentence: "I would like to express my appreciation for your help.",
      sentenceArabic: "أود express تقديري for مساعدتك.",
    },
    {
      english: "arbitrary",
      arabic: "اعتباطي",
      sentence: "The decision seemed completely arbitrary.",
      sentenceArabic: "بدا القرار اعتباطيًا completely.",
    },
    {
      english: "architectural",
      arabic: "هندسي",
      sentence: "The city is famous for its architectural heritage.",
      sentenceArabic: "تشتهر المدينة بتراثها الهندسي.",
    },
    {
      english: "archive",
      arabic: "أرشيف",
      sentence: "The historical documents are kept in the national archive.",
      sentenceArabic: "تُحفظ الوثائق التاريخية in الأرشيف الوطني.",
    },
    {
      english: "arena",
      arabic: "ساحة",
      sentence: "The sports arena can hold twenty thousand spectators.",
      sentenceArabic: "يمكن أن تستوعب الساحة الرياضية twenty ألف متفرج.",
    },
    {
      english: "arguably",
      arabic: "يمكن القول",
      sentence: "He is arguably the greatest footballer of his generation.",
      sentenceArabic: "يمكن القول أنه greatest لاعب كرة قدم in جيله.",
    },
    {
      english: "arm",
      arabic: "ذراع",
      sentence: "She broke her arm in the fall.",
      sentenceArabic: "كسرت ذراعها in السقوط.",
    },
    {
      english: "array",
      arabic: "مجموعة",
      sentence: "The store offers a wide array of products.",
      sentenceArabic: "يقدم المتجر مجموعة wide of المنتجات.",
    },
    {
      english: "articulate",
      arabic: "يفصح",
      sentence: "She was able to articulate her ideas clearly.",
      sentenceArabic: "كانت قادرة على الإفصال about أفكارها clearly.",
    },
    {
      english: "ash",
      arabic: "رماد",
      sentence: "Volcanic ash covered the town.",
      sentenceArabic: "غطى الرماد البركاني البلدة.",
    },
    {
      english: "aspiration",
      arabic: "طموح",
      sentence: "Her aspiration is to become a doctor.",
      sentenceArabic: "طموحها هو become طبيبة.",
    },
    {
      english: "aspire",
      arabic: "يطمح",
      sentence: "Many young people aspire to a career in music.",
      sentenceArabic: "يطمح many شباب to مهنة in الموسيقى.",
    },
    {
      english: "assassination",
      arabic: "اغتيال",
      sentence:
        "The assassination of the leader plunged the country into chaos.",
      sentenceArabic: "ألقى اغتيال القائد البلاد in فوضى.",
    },
    {
      english: "assault",
      arabic: "اعتداء",
      sentence: "He was charged with assault after the fight.",
      sentenceArabic: "تمت تهمته with اعتداء after المشاجرة.",
    },
    {
      english: "commissioner",
      arabic: "مفوض",
      sentence: "The police commissioner held a press conference.",
      sentenceArabic: "عقد مفوض الشرطة conference صحفية.",
    },
    {
      english: "commodity",
      arabic: "سلعة",
      sentence: "Oil is the country's most important commodity.",
      sentenceArabic: "النفط هو السلعة important most للبلاد.",
    },
    {
      english: "communist",
      arabic: "شيوعي",
      sentence: "He was a member of the communist party.",
      sentenceArabic: "كان عضوًا in الحزب الشيوعي.",
    },
    {
      english: "companion",
      arabic: "رفيق",
      sentence: "The dog was her constant companion.",
      sentenceArabic: "كان الكلب رفيقها constant.",
    },
    {
      english: "comparable",
      arabic: "مماثل",
      sentence: "The two situations are not comparable.",
      sentenceArabic: "الوضعان ليسا مماثلين.",
    },
    {
      english: "compassion",
      arabic: "تعاطف",
      sentence: "She showed great compassion for the victims.",
      sentenceArabic: "أظهرت تعاطفًا great for الضحايا.",
    },
    {
      english: "compel",
      arabic: "يجبر",
      sentence: "The law compels employers to provide safe working conditions.",
      sentenceArabic: "يجبر القانون employers to توفير ظروف عمل آمنة.",
    },
    {
      english: "compelling",
      arabic: "مقنع",
      sentence: "She gave a compelling reason for her absence.",
      sentenceArabic: "قدمت سببًا مقنعًا for غيابها.",
    },
    {
      english: "compensate",
      arabic: "يعوض",
      sentence: "The company will compensate customers for the inconvenience.",
      sentenceArabic: "ستعوض الشركة customers for الإزعاج.",
    },
    {
      english: "compensation",
      arabic: "تعويض",
      sentence: "He received compensation for the injuries he sustained.",
      sentenceArabic: "تلقى تعويضًا about الإصابات التي sustainedها.",
    },
    {
      english: "competence",
      arabic: "كفاءة",
      sentence: "His professional competence is not in question.",
      sentenceArabic: "كفاءته المهنية ليست in question.",
    },
    {
      english: "competent",
      arabic: " competent",
      sentence: "She is a highly competent manager.",
      sentenceArabic: "هي مديرة competent highly.",
    },
    {
      english: "compile",
      arabic: "يجمع",
      sentence: "It took years to compile the data for the report.",
      sentenceArabic: "أخذ years جمع البيانات for التقرير.",
    },
    {
      english: "complement",
      arabic: "يتمم",
      sentence: "The wine complements the cheese perfectly.",
      sentenceArabic: "يتمم النبيذ الجبن perfectly.",
    },
    {
      english: "complexity",
      arabic: "تعقيد",
      sentence: "I was surprised by the complexity of the issue.",
      sentenceArabic: "فاجأني تعقيد القضية.",
    },
    {
      english: "compliance",
      arabic: "امتثال",
      sentence: "Strict compliance with the regulations is required.",
      sentenceArabic: "مطلوب امتثال strict with اللوائح.",
    },
    {
      english: "complication",
      arabic: "تعقيد",
      sentence: "The surgery was successful with no complications.",
      sentenceArabic: "كانت الجراحة ناجحة without تعقيدات.",
    },
    {
      english: "comply",
      arabic: " يمتثل",
      sentence: "Failure to comply with the rules will result in penalties.",
      sentenceArabic: "سيؤدي الفشل in الامتثال for القواعد to عقوبات.",
    },
    {
      english: "composition",
      arabic: "تكوين",
      sentence: "Scientists studied the chemical composition of the rock.",
      sentenceArabic: "درس العلماء التكوين الكيميائي for الصخرة.",
    },
    {
      english: "compromise",
      arabic: " حل وسط",
      sentence: "Both sides will have to compromise to reach an agreement.",
      sentenceArabic: "سيضطر كلا الطرفين to المساومة to الوصول إلى اتفاق.",
    },
    {
      english: "compute",
      arabic: "يحسب",
      sentence: "The system can compute complex calculations in seconds.",
      sentenceArabic: "يمكن للنظام حساب calculations معقدة in ثوانٍ.",
    },
    {
      english: "conceal",
      arabic: "يخفي",
      sentence: "He tried to conceal his disappointment.",
      sentenceArabic: "حاول إخفاء خيبة أمله.",
    },
    {
      english: "concede",
      arabic: "يعترف",
      sentence: "The government conceded defeat in the election.",
      sentenceArabic: "اعترفت الحكومة بالهزيمة in الانتخابات.",
    },
    {
      english: "conceive",
      arabic: "يتصور",
      sentence: "It is difficult to conceive of a world without electricity.",
      sentenceArabic: "من الصعب التصور of عالم without كهرباء.",
    },
    {
      english: "conception",
      arabic: "تصور",
      sentence: "The artist's conception of the future was bleak.",
      sentenceArabic: "كان تصور الفنان for المستقبل قاتمًا.",
    },
    {
      english: "concession",
      arabic: "تنازل",
      sentence: "The company made several concessions to the workers' demands.",
      sentenceArabic: "قدمت الشركة several تنازلات for مطالب العمال.",
    },
    {
      english: "condemn",
      arabic: "يدين",
      sentence: "The international community condemned the invasion.",
      sentenceArabic: "دان المجتمع الدولي الغزو.",
    },
    {
      english: "confer",
      arabic: " يمنح",
      sentence: "The university will confer an honorary degree upon her.",
      sentenceArabic: "ستمنح الجامعة degree فخريًا uponها.",
    },
    {
      english: "confession",
      arabic: "اعتراف",
      sentence: "After hours of questioning, he made a full confession.",
      sentenceArabic: "after ساعات من الاستجواب، قدم اعترافًا full.",
    },
    {
      english: "configuration",
      arabic: "تكوين",
      sentence:
        "The configuration of the molecules determines their properties.",
      sentenceArabic: "يحدد تكوين الجزيئات خصائصها.",
    },
    {
      english: "confine",
      arabic: "يحصر",
      sentence: "Please confine your remarks to the topic at hand.",
      sentenceArabic: "من فضلك احصر ملاحظاتك to الموضوع at hand.",
    },
    {
      english: "confirmation",
      arabic: "تأكيد",
      sentence: "We are waiting for confirmation of the flight details.",
      sentenceArabic: "ننتظر تأكيد details الرحلة.",
    },
    {
      english: "confront",
      arabic: "يواجه",
      sentence: "She decided to confront him about his behavior.",
      sentenceArabic: "قررت مواجهته about سلوكه.",
    },
    {
      english: "confrontation",
      arabic: "مواجهة",
      sentence:
        "The debate led to a heated confrontation between the two candidates.",
      sentenceArabic: "أدى النقاش to مواجهة heated between المرشحين.",
    },
    {
      english: "congratulate",
      arabic: "يهنئ",
      sentence: "I congratulated her on her promotion.",
      sentenceArabic: "هنأتها on ترقيتها.",
    },
    {
      english: "congregation",
      arabic: "جماعة",
      sentence: "The congregation prayed for peace.",
      sentenceArabic: "صلى الجماعة for السلام.",
    },
    {
      english: "congressional",
      arabic: "كونغرسي",
      sentence:
        "A congressional committee was formed to investigate the matter.",
      sentenceArabic: "تم تشكيل لجنة كونغرسية to التحقيق in الأمر.",
    },
    {
      english: "conquer",
      arabic: "يغزو",
      sentence: "The army set out to conquer new territories.",
      sentenceArabic: "انطلق الجيش to غزو أقاليم new.",
    },
    {
      english: "conscience",
      arabic: "ضمير",
      sentence: "His conscience wouldn't allow him to lie.",
      sentenceArabic: "لم يسمح ضميره له بالكذب.",
    },
    {
      english: "consciousness",
      arabic: "وعي",
      sentence: "She lost consciousness for several minutes after the impact.",
      sentenceArabic: "فقدت الوعي for several دقائق after الاصطدام.",
    },
    {
      english: "consecutive",
      arabic: "متتالي",
      sentence: "This is their fifth consecutive victory.",
      sentenceArabic: "هذا هو فوزهم الخامس المتتالي.",
    },
    {
      english: "consensus",
      arabic: "إجماع",
      sentence: "There is a general consensus that action needs to be taken.",
      sentenceArabic: "هناك إجماع general that需要 اتخاذ إجراء.",
    },
    {
      english: "consent",
      arabic: "موافقة",
      sentence: "You cannot undergo surgery without your consent.",
      sentenceArabic: "لا يمكنك الخضوع for جراحة without موافقتك.",
    },
    {
      english: "conserve",
      arabic: "يحافظ",
      sentence: "We must conserve water during the drought.",
      sentenceArabic: "يجب أن نحافظ on المياه during الجفاف.",
    },
    {
      english: "consistency",
      arabic: "اتساق",
      sentence: "The consistency of his argument made it persuasive.",
      sentenceArabic: "جعل اتساق حجته مقنعًا.",
    },
    {
      english: "consolidate",
      arabic: "يدمج",
      sentence: "The company plans to consolidate its operations.",
      sentenceArabic: "تخطط الشركة لدمج عملياتها.",
    },
    {
      english: "constituency",
      arabic: "دائرة انتخابية",
      sentence: "She represents a rural constituency.",
      sentenceArabic: "تمثل دائرة انتخابية ريفية.",
    },
    {
      english: "constitute",
      arabic: "يشكل",
      sentence: "Women constitute the majority of the workforce.",
      sentenceArabic: "تشكل النساء الأغلبية of القوى العاملة.",
    },
    {
      english: "constitution",
      arabic: "دستور",
      sentence: "The right to free speech is protected by the constitution.",
      sentenceArabic: "الحق في حرية التعبير محمي by الدستور.",
    },
    {
      english: "constitutional",
      arabic: "دستوري",
      sentence:
        "The court will rule on the constitutional validity of the law.",
      sentenceArabic: "ستحكم المحكمة on الصحة الدستورية for القانون.",
    },
    {
      english: "constraint",
      arabic: "قيد",
      sentence: "Financial constraints limited their options.",
      sentenceArabic: "قيدت القيود المالية خياراتهم.",
    },
    {
      english: "drift",
      arabic: "ينجرف",
      sentence: "The boat began to drift towards the rocks.",
      sentenceArabic: "بدأ القارب ينجرف towards الصخور.",
    },
    {
      english: "driving",
      arabic: "قيادة",
      sentence: "Driving under the influence of alcohol is dangerous.",
      sentenceArabic: "القيادة under تأثير الكحول dangerous.",
    },
    {
      english: "drown",
      arabic: "يغرق",
      sentence: "Two people drowned when the boat capsized.",
      sentenceArabic: "غرق شخصان when انقلب القارب.",
    },
    {
      english: "dual",
      arabic: "مزدوج",
      sentence: "She has dual citizenship.",
      sentenceArabic: "لديها جنسية مزدوجة.",
    },
    {
      english: "dub",
      arabic: "يطلق عليه",
      sentence: "Critics dubbed the new policy 'a disaster'.",
      sentenceArabic: "أطلق النقاد على السياسة الجديدة اسم 'كارثة'.",
    },
    {
      english: "dumb",
      arabic: "أبكم",
      sentence: "The accident left him dumb and unable to speak.",
      sentenceArabic: "تركه الحادث أبكمًا وغير قادر on الكلام.",
    },
    {
      english: "duo",
      arabic: "ثنائي",
      sentence: "The musical duo released their first album last year.",
      sentenceArabic: "أصدر الثنائي الموسيقي أول ألبوم له last عام.",
    },
    {
      english: "dynamic",
      arabic: "ديناميكي",
      sentence: "The city has a dynamic and growing economy.",
      sentenceArabic: "تمتلك المدينة اقتصادًا ديناميكيًا ومتناميًا.",
    },
    {
      english: "eager",
      arabic: "متحمس",
      sentence: "The children were eager to open their presents.",
      sentenceArabic: "كان الأطفال متحمسين to فتح هداياهم.",
    },
    {
      english: "earnings",
      arabic: "أرباح",
      sentence: "The company's earnings exceeded expectations this quarter.",
      sentenceArabic: "تجاوزت أرباح الشركة التوقعات this ربع سنة.",
    },
    {
      english: "ease",
      arabic: "يخفف",
      sentence: "The medicine should ease the pain.",
      sentenceArabic: "يجب أن يخفف الدواء الألم.",
    },
    {
      english: "echo",
      arabic: "صدى",
      sentence: "His words echoed around the empty hall.",
      sentenceArabic: "صدى كلامه around القاعة الفارغة.",
    },
    {
      english: "ecological",
      arabic: "بيئي",
      sentence: "The project has caused significant ecological damage.",
      sentenceArabic: "تسبب المشروع في damage بيئي significant.",
    },
    {
      english: "educator",
      arabic: "معلم",
      sentence:
        "She is a respected educator with over thirty years of experience.",
      sentenceArabic: "هي معلمة محترمة with over ثلاثين عامًا of خبرة.",
    },
    {
      english: "effectiveness",
      arabic: "فعالية",
      sentence: "The effectiveness of the new drug is being tested.",
      sentenceArabic: "يتم اختبار فعالية الدواء الجديد.",
    },
    {
      english: "efficiency",
      arabic: "كفاءة",
      sentence: "The new engine has greatly improved fuel efficiency.",
      sentenceArabic: "حسّن المحرك الجديد كفاءة الوقود greatly.",
    },
    {
      english: "ego",
      arabic: "أنا",
      sentence: "His massive ego makes it difficult to work with him.",
      sentenceArabic: "أناّه الضخمة تجعل العمل withه صعبًا.",
    },
    {
      english: "elaborate",
      arabic: "مفصل",
      sentence: "She gave an elaborate description of the event.",
      sentenceArabic: "قدمت وصفًا مفصلاً for الحدث.",
    },
    {
      english: "electoral",
      arabic: "انتخابي",
      sentence: "Electoral reform is a major issue in the campaign.",
      sentenceArabic: "يمثل الإصلاح الانتخابي قضية major in الحملة.",
    },
    {
      english: "elevate",
      arabic: "يرفع",
      sentence: "The platform can be elevated to a height of ten meters.",
      sentenceArabic: "يمكن رفع المنصة to ارتفاع ten أمتار.",
    },
    {
      english: "eligible",
      arabic: "مؤهل",
      sentence: "You are eligible to vote if you are over 18.",
      sentenceArabic: "أنت مؤهل for التصويت if كنت over 18.",
    },
    {
      english: "elite",
      arabic: "نخبة",
      sentence: "The school caters to the children of the elite.",
      sentenceArabic: "تخدم المدرسة أطفال النخبة.",
    },
    {
      english: "embark",
      arabic: "يشرع",
      sentence: "They are about to embark on a new adventure.",
      sentenceArabic: "هم على وشك الشروع in مغامرة new.",
    },
    {
      english: "embarrassment",
      arabic: "إحراج",
      sentence: "To her embarrassment, she forgot his name.",
      sentenceArabic: "لإحراجها، نسيت اسمه.",
    },
    {
      english: "embassy",
      arabic: "سفارة",
      sentence: "He works at the French embassy.",
      sentenceArabic: "يعمل in السفارة الفرنسية.",
    },
    {
      english: "embed",
      arabic: "يدمج",
      sentence: "The journalist was embedded with the army unit.",
      sentenceArabic: "تم دمج الصحفي with وحدة الجيش.",
    },
    {
      english: "embody",
      arabic: "يجسد",
      sentence: "She embodies the values of the organization.",
      sentenceArabic: "هي تجسد قيم المنظمة.",
    },
    {
      english: "emergence",
      arabic: "بروز",
      sentence: "The emergence of new technologies is transforming society.",
      sentenceArabic: "يحول بروز تقنيات new المجتمع.",
    },
    {
      english: "empirical",
      arabic: "تجريبي",
      sentence: "The theory is supported by empirical evidence.",
      sentenceArabic: "تدعم evidence تجريبية النظرية.",
    },
    {
      english: "empower",
      arabic: "تمكين",
      sentence: "Education empowers people to improve their lives.",
      sentenceArabic: "يمكن التعليم people to تحسين حياتهم.",
    },
    {
      english: "enact",
      arabic: "يسن",
      sentence: "Parliament enacted a new law to protect the environment.",
      sentenceArabic: "سن البرلمان قانونًا جديدًا to حماية البيئة.",
    },
    {
      english: "encompass",
      arabic: "يشمل",
      sentence: "The report encompasses all aspects of the problem.",
      sentenceArabic: "يشمل التقرير جميع aspects المشكلة.",
    },
    {
      english: "encouragement",
      arabic: "تشجيع",
      sentence: "She gave me a lot of encouragement when I was struggling.",
      sentenceArabic: "قدمت لي much تشجيع when كنت أعاني.",
    },
    {
      english: "encouraging",
      arabic: "مشجع",
      sentence: "The results of the test are very encouraging.",
      sentenceArabic: "نتائج الاختبار مشجعة very.",
    },
    {
      english: "endeavour",
      arabic: "مسعى",
      sentence:
        "The expedition was a scientific endeavour to study the Arctic.",
      sentenceArabic: "كانت البعثة مسعى علميًا to دراسة القطب الشمالي.",
    },
    {
      english: "endless",
      arabic: "لا نهائي",
      sentence: "The possibilities are endless.",
      sentenceArabic: "الإمكانيات لا نهائية.",
    },
    {
      english: "endorse",
      arabic: "يؤيد",
      sentence: "The committee endorsed the proposed changes.",
      sentenceArabic: "أيدت اللجنة التغييرات المقترحة.",
    },
    {
      english: "rip",
      arabic: "يمزق",
      sentence:
        "Be careful not to rip the document when you open the envelope.",
      sentenceArabic: "كن حذرًا من أن تمزق المستند عندما تفتح الظرف.",
    },
    {
      english: "ritual",
      arabic: "طقوس",
      sentence:
        "The morning coffee and newspaper reading became a cherished ritual for him.",
      sentenceArabic: "أصبحت قهوة الصباح وقراءة الجريدة طقوسًا عزيزة عليه.",
    },
    {
      english: "robust",
      arabic: "قوي / متين",
      sentence:
        "The economy has shown robust growth despite global uncertainties.",
      sentenceArabic:
        "أظهر الاقتصاد نموًا قويًا على الرغم من عدم الاستقرار العالمي.",
    },
    {
      english: "rock",
      arabic: "يهز / صخرة",
      sentence: "The scandal rocked the very foundations of the government.",
      sentenceArabic: "هزت الفضيحة أسس الحكومة ذاتها.",
    },
    {
      english: "rod",
      arabic: "قضيب / عصا",
      sentence: "The curtains hung from a delicate brass rod.",
      sentenceArabic: "علقت الستائر على قضيب نحاسي رفيع.",
    },
    {
      english: "rotate",
      arabic: "يدور / يُدير",
      sentence: "The team members rotate the leadership role every month.",
      sentenceArabic: "أفراد الفريق يدورون على دور القيادة كل شهر.",
    },
    {
      english: "rotation",
      arabic: "دوران",
      sentence:
        "The rotation of crops is essential for maintaining soil fertility.",
      sentenceArabic: "دوران المحاصيل ضروري للحفاظ على خصوبة التربة.",
    },
    {
      english: "ruling",
      arabic: "حكم / قرار",
      sentence: "The court's ruling set a new legal precedent.",
      sentenceArabic: "حكم المحكمة وضع سابقة قانونية جديدة.",
    },
    {
      english: "rumour",
      arabic: "إشاعة",
      sentence: "A rumour began to circulate that the CEO was about to resign.",
      sentenceArabic: "بدأت إشاعة تنتشر بأن الرئيس التنفيذي على وشك الاستقالة.",
    },
    {
      english: "sack",
      arabic: "يُطرد / كيس",
      sentence:
        "He was sacked for gross misconduct after the internal investigation.",
      sentenceArabic: "تم طرده بسبب سوء السلوك الجسيم بعد التحقيق الداخلي.",
    },
    {
      english: "syndrome",
      arabic: "متلازمة",
      sentence: "She specializes in studying rare genetic syndromes.",
      sentenceArabic: "هي تختص في دراسة المتلازمات الجينية النادرة.",
    },
    {
      english: "synthesis",
      arabic: "توليف / تركيب",
      sentence:
        "His work is a brilliant synthesis of Eastern and Western philosophical ideas.",
      sentenceArabic: "عمله هو توليف بارع لأفكار الفلسفة الشرقية والغربية.",
    },
    {
      english: "systematic",
      arabic: "منهجي",
      sentence:
        "They conducted a systematic review of all the available literature.",
      sentenceArabic: "أجروا مراجعة منهجية لجميع الأدبيات المتاحة.",
    },
    {
      english: "tackle",
      arabic: "يعالج / يتصدى لـ",
      sentence:
        "The new policy aims to tackle inequality and social injustice.",
      sentenceArabic:
        "تهدف السياسة الجديدة إلى معالجة عدم المساواة والظلم الاجتماعي.",
    },
    {
      english: "tactic",
      arabic: "تكتيك",
      sentence:
        "Their delay was merely a stalling tactic to avoid making a decision.",
      sentenceArabic: "كان تأخيرهم مجرد تكتيك مماطلة لتجنب اتخاذ قرار.",
    },
    {
      english: "tactical",
      arabic: "تكتيكي",
      sentence: "The general made a tactical withdrawal to regroup his forces.",
      sentenceArabic: "قام الجنرال بانسحاب تكتيكي لإعادة تجميع قواته.",
    },
    {
      english: "taxpayer",
      arabic: "دافع الضرائب",
      sentence:
        "The project was heavily criticized as a waste of taxpayers' money.",
      sentenceArabic:
        "تم انتقاد المشروع بشدة على أنه إهدار لأموال دافعي الضرائب.",
    },
    {
      english: "tempt",
      arabic: "يغري / يجذب",
      sentence:
        "The low price might tempt you to buy a product you don't really need.",
      sentenceArabic: "قد يغريك السعر المنخفض لشراء منتج لا تحتاجه حقًا.",
    },
    {
      english: "tenant",
      arabic: "مستأجر",
      sentence:
        "The landlord is responsible for maintaining the property for his tenants.",
      sentenceArabic: "المالك مسؤول عن صيانة العقار لمستأجريه.",
    },
    {
      english: "tender",
      arabic: "عطاء / مناقصة",
      sentence:
        "Several firms submitted a tender for the construction contract.",
      sentenceArabic: "قدمت عدة شركات عطاءً لعقد البناء.",
    },
    {
      english: "tenure",
      arabic: "عهدة / فترة شغل منصب",
      sentence:
        "During his tenure as ambassador, he fostered stronger diplomatic ties.",
      sentenceArabic: "خلال عهدته كسفير، عزز روابط دبلوماسية أقوى.",
    },
    {
      english: "terminate",
      arabic: "يُنهي / يفسخ",
      sentence:
        "The company reserved the right to terminate the contract with immediate effect.",
      sentenceArabic: "حافظت الشركة على الحق في إنهاء العقد فورًا.",
    },
    {
      english: "terrain",
      arabic: "تضاريس",
      sentence: "The vehicle is specially designed to handle rough terrain.",
      sentenceArabic: "تم تصميم المركبة خصيصًا للسير على التضاريس الوعرة.",
    },
    {
      english: "terrific",
      arabic: "رائع / مذهل",
      sentence: "She's doing a terrific job under immense pressure.",
      sentenceArabic: "إنها تقوم بعمل رائع تحت ضغط هائل.",
    },
    {
      english: "testify",
      arabic: "يشهد",
      sentence: "The witness refused to testify for fear of reprisals.",
      sentenceArabic: "رفض الشاهد الإدلاء بشهادته خوفًا من أعمال انتقامية.",
    },
    {
      english: "testimony",
      arabic: "شهادة",
      sentence:
        "His recovery is a powerful testimony to the effectiveness of the new treatment.",
      sentenceArabic: "شفاؤه هو شهادة قوية على فعالية العلاج الجديد.",
    },
    {
      english: "texture",
      arabic: "ملمس",
      sentence:
        "The artist uses materials to add texture and depth to her paintings.",
      sentenceArabic: "تستخدم الفنانة المواد لإضافة ملمس وعمق لوحاتها.",
    },
    {
      english: "thankfully",
      arabic: "لحسن الحظ",
      sentence: "Thankfully, nobody was seriously injured in the accident.",
      sentenceArabic: "لحسن الحظ، لم يصب أحد بجروح خطيرة في الحادث.",
    },
    {
      english: "theatrical",
      arabic: "مسرحي / متكلف",
      sentence: "He dismissed her anger with a theatrical wave of his hand.",
      sentenceArabic: "رفض غضبها بموجة متكلفة من يده.",
    },
    {
      english: "theology",
      arabic: "لاهوت",
      sentence:
        "He pursued a degree in theology before entering the priesthood.",
      sentenceArabic: "درس درجة académية في اللاهوت قبل دخول الكهنوت.",
    },
    {
      english: "theoretical",
      arabic: "نظري",
      sentence:
        "On a theoretical level, the plan is sound, but the practical challenges are immense.",
      sentenceArabic:
        "على المستوى النظري، الخطة سليمة، ولكن التحديات العملية هائلة.",
    },
    {
      english: "thereafter",
      arabic: "بعد ذلك",
      sentence:
        "He graduated in 2010 and thereafter moved to London to pursue his career.",
      sentenceArabic:
        "تخرج في عام 2010 وبعد ذلك انتقل إلى لندن لمتابعة مسيرته المهنية.",
    },
    {
      english: "thereby",
      arabic: "وبالتالي",
      sentence:
        "They aimed to reduce the cost, thereby making the product more accessible.",
      sentenceArabic:
        "هدفت إلى تقليل التكلفة، وبالتالي جعل المنتج في متناول الجميع.",
    },
    {
      english: "thoughtful",
      arabic: "وقور / مدروس",
      sentence:
        "It was a thoughtful gesture that demonstrated his genuine concern.",
      sentenceArabic: "كانت بادرة وقورة أظهرت قلقه الصادق.",
    },
    {
      english: "thought-provoking",
      arabic: "يُحفز على التفكير",
      sentence:
        "The documentary posed a series of thought-provoking questions about our society.",
      sentenceArabic:
        "طرح الوثائقي سلسلة من الأسئلة التي تحفز على التفكير حول مجتمعنا.",
    },
    {
      english: "thread",
      arabic: "خيط / موضوع (نقاش)",
      sentence:
        "I lost the thread of the argument amidst all the interruptions.",
      sentenceArabic: "فقدت خيط النقاش وسط جميع المقاطعات.",
    },
    {
      english: "threshold",
      arabic: "عتبة",
      sentence: "The income level was set just below the poverty threshold.",
      sentenceArabic: "تم تحديد مستوى الدخل juste below عتبة الفقر.",
    },
    {
      english: "thrilled",
      arabic: "مندهش / سعيد جدًا",
      sentence: "We were absolutely thrilled to hear the good news.",
      sentenceArabic: "كنا سعداء جدًا لسماع الأخبار السارة.",
    },
    {
      english: "thrive",
      arabic: "يزدهر",
      sentence: "Some plants thrive in shaded, humid environments.",
      sentenceArabic: "بعض النباتات تزدهر في البيئات المظللة والرطبة.",
    },
    {
      english: "tide",
      arabic: "مد وجزر",
      sentence:
        "The charity's work aims to turn the tide against homelessness in the city.",
      sentenceArabic:
        "يهدف عمل الجمعية الخيرية إلى逆转 مد ظاهرة التشرد في المدينة.",
    },
    {
      english: "tighten",
      arabic: "يشدد / يضيق",
      sentence:
        "The government promised to tighten regulations on financial institutions.",
      sentenceArabic: "وعدت الحكومة بتشديد اللوائح المنظمة للمؤسسات المالية.",
    },
    {
      english: "timber",
      arabic: "أخشاب",
      sentence: "The house was built from sustainably sourced timber.",
      sentenceArabic: "تم بناء المنزل من أخشاب مصدرها مستدام.",
    },
    {
      english: "timely",
      arabic: "في الوقت المناسب",
      sentence: "His timely intervention prevented a major disaster.",
      sentenceArabic: "منع تدخله في الوقت المناسب وقوع كارثة كبرى.",
    },
    {
      english: "tobacco",
      arabic: "تبغ",
      sentence:
        "The legislation imposed strict controls on the advertising of tobacco products.",
      sentenceArabic: "فرض التشريع ضوابط صارمة على الإعلان عن منتجات التبغ.",
    },
    {
      english: "tolerance",
      arabic: "تسامح / تحمل",
      sentence:
        "There is a growing culture of tolerance and diversity within the community.",
      sentenceArabic: "هناك ثقافة متنامية من التسامح والتنوع داخل المجتمع.",
    },
    {
      english: "tolerate",
      arabic: "يتسامح مع / يتحمل",
      sentence: "The school does not tolerate bullying in any form.",
      sentenceArabic: "المدرسة لا تتسامح مع التنمر بأي شكل من الأشكال.",
    },
    {
      english: "toll",
      arabic: "حصيلة / ضريبة",
      sentence:
        "The emotional toll of caring for a sick relative can be overwhelming.",
      sentenceArabic:
        "يمكن أن تكون الحصيلة العاطفية لرعاية قريب مريض overwhelming.",
    },
    {
      english: "top",
      arabic: "يقّلد / يرأس",
      sentence: "She topped the list of the world's most influential people.",
      sentenceArabic: "تقلدت صدارة قائمة أكثر الأشخاص تأثيرًا في العالم.",
    },
    {
      english: "torture",
      arabic: "تعذيب",
      sentence:
        "The regime was accused of using torture to extract confessions.",
      sentenceArabic: "اتهم النظام باستخدام التعذيب لانتزاع الاعترافات.",
    },
    {
      english: "toss",
      arabic: "يقذف / يرمي (بخفة)",
      sentence: "He tossed the keys onto the table and walked out.",
      sentenceArabic: "ألقى بالمفاتيح على الطاولة وخرج.",
    },
    {
      english: "total",
      arabic: "كلي / تام",
      sentence:
        "The project was a total failure, wasting millions in investment.",
      sentenceArabic: "كان المشروع فشلاً كليًا، مما أهدر ملايين الاستثمار.",
    },
    {
      english: "weaken",
      arabic: "يُضعف",
      sentence:
        "Sanctions were imposed to weaken the enemy's military capability.",
      sentenceArabic: "فُرضت عقوبات لإضعاف القدرة العسكرية للعدو.",
    },
    {
      english: "weave",
      arabic: "يحيك / ينسج",
      sentence:
        "The author skillfully weaves together multiple narrative threads.",
      sentenceArabic: "يحيك المؤلف بمهارة خيوطًا سردية متعددة.",
    },
    {
      english: "weed",
      arabic: "يعزق / يقتلع الأعشاب الضارة",
      sentence: "It took me all afternoon to weed the garden.",
      sentenceArabic: "استغرق مني الأمر طوال الظهيرة لأعزق الحديقة.",
    },
    {
      english: "well",
      arabic: "بئر",
      sentence: "They dug a well to access clean water for the village.",
      sentenceArabic: "حفروا بئرًا للوصول إلى مياه نظيفة للقرية.",
    },
    {
      english: "well-being",
      arabic: "رفاهية",
      sentence: "Employee well-being is a top priority for the company.",
      sentenceArabic: "رفاهية الموظفين هي أولوية قصوى للشركة.",
    },
    {
      english: "whatsoever",
      arabic: "على الإطلاق",
      sentence:
        "There is no evidence whatsoever to support these outrageous claims.",
      sentenceArabic:
        "لا توجد أي أدلة على الإطلاق تدعم these الادعاءات الفاضحة.",
    },
    {
      english: "whereby",
      arabic: "حيث / whereby (بموجبه)",
      sentence:
        "They established a system whereby decisions are made collectively.",
      sentenceArabic: "أسسوا نظامًا تُتخذ فيه القرارات بشكل جماعي.",
    },
    {
      english: "whilst",
      arabic: "بينما / في حين",
      sentence:
        "He excelled in mathematics, whilst his sister showed a talent for languages.",
      sentenceArabic: "تفوق في الرياضيات، بينما أظهرت أخته موهبة في اللغات.",
    },
    {
      english: "whip",
      arabic: "سوط / يخفق",
      sentence:
        "The party leader tried to whip his members into voting for the bill.",
      sentenceArabic:
        "حاول زعيم الحزب أن يجبر أعضاءه على التصويت لصالح مشروع القانون.",
    },
    {
      english: "wholly",
      arabic: "كليًا / تمامًا",
      sentence: "I am wholly convinced of the necessity of this action.",
      sentenceArabic: "أنا مقتنع كليًا بضرورة هذا الإجراء.",
    },
    {
      english: "widen",
      arabic: "يوسع",
      sentence: "The gap between rich and poor continues to widen.",
      sentenceArabic: "تستمر الفجوة بين الأغنياء والفقراء في الاتساع.",
    },
    {
      english: "widow",
      arabic: "أرملة",
      sentence: "She was left a widow with three young children to raise.",
      sentenceArabic: "تُركت أرملة مع ثلاثة أطفال صغار لتربيتهم.",
    },
    {
      english: "width",
      arabic: "عرض",
      sentence:
        "Measure the length and width of the room before ordering the carpet.",
      sentenceArabic: "قم بقياس طول وعرض الغرفة قبل طلب السجادة.",
    },
    {
      english: "albeit",
      arabic: "وإن كان / رغم أن",
      sentence: "The plan was successful, albeit at a great cost.",
      sentenceArabic: "كانت الخطة ناجحة، رغم أن ذلك كان بتكلفة باهظة.",
    },
    {
      english: "alert",
      arabic: "يُنبه / إنذار",
      sentence: "The authorities were alerted to the potential threat.",
      sentenceArabic: "تم تنبيه السلطات إلى التهديد المحتمل.",
    },
    {
      english: "alien",
      arabic: "غريب / فضائي",
      sentence: "The concept was utterly alien to their way of thinking.",
      sentenceArabic: "كان المفهوم غريبًا تمامًا عن طريقة تفكيرهم.",
    },
    {
      english: "align",
      arabic: "يحاذي / يمحّى",
      sentence: "Our goals must align with the company's overall strategy.",
      sentenceArabic: "يجب أن تتماشى أهدافنا مع الاستراتيجية العامة للشركة.",
    },
    {
      english: "alignment",
      arabic: "محاذاة / انحياز",
      sentence: "There was a perfect alignment of the planets that year.",
      sentenceArabic: "كان هناك محاذاة مثالية للكواكب في ذلك العام.",
    },
    {
      english: "alike",
      arabic: "على حد سواء",
      sentence: "The news shocked politicians and public alike.",
      sentenceArabic: "صدمت الأخبار السياسيين والجمهور على حد سواء.",
    },
    {
      english: "allegation",
      arabic: "ادعاء / مزاعم",
      sentence:
        "He strongly denied the allegations of corruption made against him.",
      sentenceArabic: "أنكر بشدة مزاعم الفساد التي وجهت إليه.",
    },
    {
      english: "allege",
      arabic: "يدعي",
      sentence:
        "The prosecution alleged that he had acted with malicious intent.",
      sentenceArabic: "ادعت النيابة أنه تصرف بنية خبيثة.",
    },
    {
      english: "allegedly",
      arabic: "زُعم / allegedly",
      sentence: "The allegedly stolen goods were found in his possession.",
      sentenceArabic: "تم العثور على البضائع المسروقة زُعم في حوزته.",
    },
    {
      english: "alliance",
      arabic: "تحالف",
      sentence:
        "The two parties formed an alliance to secure a majority in parliament.",
      sentenceArabic: "شكل الحزبان تحالفًا لتأمين أغلبية في البرلمان.",
    },
    {
      english: "allocate",
      arabic: "يخصص",
      sentence:
        "A significant budget has been allocated for research and development.",
      sentenceArabic: "تم تخصيص ميزانية كبيرة للبحث والتطوير.",
    },
    {
      english: "allocation",
      arabic: "تخصيص",
      sentence:
        "The fair allocation of resources remains a significant challenge.",
      sentenceArabic: "يظل التخصيص العادل للموارد تحديًا كبيرًا.",
    },
    {
      english: "allowance",
      arabic: "بدل / علاوة",
      sentence:
        "Employees receive a daily allowance for food and travel when on business trips.",
      sentenceArabic:
        "يحصل الموظفون على بدل يومي للطعام والسفر أثناء الرحلات العملية.",
    },
    {
      english: "ally",
      arabic: "حليف",
      sentence:
        "The country sought to strengthen its position by finding a powerful ally.",
      sentenceArabic: "سعت الدولة إلى تعزيز موقعها من خلال إيجاد حليف قوي.",
    },
    {
      english: "aluminium",
      arabic: "ألومنيوم",
      sentence: "The frame is made of lightweight aluminium.",
      sentenceArabic: "الإطار مصنوع من الألومنيوم خفيف الوزن.",
    },
    {
      english: "amateur",
      arabic: "هواة",
      sentence:
        "The competition is open to both professional and amateur photographers.",
      sentenceArabic: "المسابقة مفتوحة للمصورين المحترفين وهواة التصوير.",
    },
    {
      english: "ambassador",
      arabic: "سفير",
      sentence: "She served as the cultural ambassador for her country.",
      sentenceArabic: "شغلت منصب السفيرة الثقافية لبلدها.",
    },
    {
      english: "amend",
      arabic: "يعدل / يصحح",
      sentence: "The law was amended to include stricter penalties.",
      sentenceArabic: "تم تعديل القانون ليشمل عقوبات أكثر صرامة.",
    },
    {
      english: "amendment",
      arabic: "تعديل",
      sentence:
        "The first amendment to the US Constitution guarantees freedom of speech.",
      sentenceArabic:
        "التعديل الأول لدستور الولايات المتحدة يضمن حرية التعبير.",
    },
    {
      english: "amid",
      arabic: "وسط",
      sentence:
        "The peace talks took place amid rising tensions in the region.",
      sentenceArabic: "جرت مفاوضات السلام وسط توترات متصاعدة في المنطقة.",
    },
    {
      english: "analogy",
      arabic: "قياس / تشبيه",
      sentence:
        "He explained the complex economic concept by drawing an analogy with a household budget.",
      sentenceArabic:
        "شرح المفهوم الاقتصادي المعقد عن طريق تشبيهه بميزانية المنزل.",
    },
    {
      english: "anchor",
      arabic: "مرساة / يرسي",
      sentence:
        "The ancient oak tree seemed to anchor the entire village green.",
      sentenceArabic:
        "بدا أن شجرة البلوط القديمة تَرسي الساحة الخضراء للقرية بأكملها.",
    },
    {
      english: "angel",
      arabic: "ملاك",
      sentence:
        "She's been an absolute angel, helping me through this difficult time.",
      sentenceArabic: "لقد كانت ملاكًا مطلقًا، ساعدتني خلال هذه الفترة الصعبة.",
    },
    {
      english: "anonymous",
      arabic: "مجهول",
      sentence: "An anonymous donor contributed a large sum to the charity.",
      sentenceArabic: "تبرع متبرع مجهول بمبلغ كبير للجمعية الخيرية.",
    },
    {
      english: "apparatus",
      arabic: "جهاز / أداة",
      sentence:
        "The laboratory was equipped with the latest scientific apparatus.",
      sentenceArabic: "كانت المختبرات مجهزة بأحدث الأجهزة العلمية.",
    },
    {
      english: "appealing",
      arabic: "جذاب / ملفت",
      sentence:
        "The idea of a holiday in the sun is particularly appealing in the middle of winter.",
      sentenceArabic:
        "فكرة قضاء عطلة تحت أشعة الشمس جذابة بشكل خاص في منتصف الشتاء.",
    },
    {
      english: "appetite",
      arabic: "شهية / رغبة",
      sentence: "The public has a huge appetite for stories about celebrities.",
      sentenceArabic: "الجمهور لديه رغبة شديدة في قصص المشاهير.",
    },
    {
      english: "applaud",
      arabic: "يصفق / يشيد",
      sentence: "We should applaud their efforts to achieve peace.",
      sentenceArabic: "يجب أن نشيد بجهودهم لتحقيق السلام.",
    },
    {
      english: "applicable",
      arabic: "قابل للتطبيق / ساري المفعول",
      sentence:
        "Is this rule applicable to everyone, including senior management?",
      sentenceArabic:
        "هل هذه القاعدة قابلة للتطبيق على الجميع، بما في ذلك الإدارة العليا؟",
    },
    {
      english: "appoint",
      arabic: "يعين",
      sentence:
        "A new director was appointed to oversee the restructuring process.",
      sentenceArabic: "تم تعيين مدير جديد للإشراف على عملية إعادة الهيكلة.",
    },
    {
      english: "appreciation",
      arabic: "تقدير",
      sentence:
        "I would like to express my appreciation for all your hard work.",
      sentenceArabic: "أود أن أعبر عن تقديري لجميع جهودك الجبارة.",
    },
    {
      english: "arbitrary",
      arabic: "اعتباطي",
      sentence:
        "The rules seemed completely arbitrary and without logical foundation.",
      sentenceArabic: "بدت القواعد اعتباطية تمامًا وبدون أساس منطقي.",
    },
    {
      english: "architectural",
      arabic: "هندسي معماري",
      sentence: "The city is famous for its unique architectural heritage.",
      sentenceArabic: "تشتهر المدينة بتراثها المعماري الفريد.",
    },
    {
      english: "archive",
      arabic: "أرشيف",
      sentence:
        "Researchers spent months sifting through the company's vast archives.",
      sentenceArabic: "قضى الباحثون شهورًا في فرز أرشيف الشركة الواسع.",
    },
    {
      english: "arena",
      arabic: "ساحة / حلبة",
      sentence:
        "The company is a major player in the international political arena.",
      sentenceArabic: "الشركة هي لاعب رئيسي في الساحة السياسية الدولية.",
    },
    {
      english: "arguably",
      arabic: "يمكن القول",
      sentence: "He is arguably the greatest footballer of his generation.",
      sentenceArabic: "يمكن القول إنه أعظم لاعب كرة القدم في جيله.",
    },
    {
      english: "arm",
      arabic: "ذراع / فرع",
      sentence:
        "The investigative arm of the organization was highly efficient.",
      sentenceArabic: "كان الفرع التحقيقي في المنظمة فعالاً للغاية.",
    },
    {
      english: "array",
      arabic: "مجموعة / ترتيب",
      sentence:
        "The conference featured an impressive array of international speakers.",
      sentenceArabic: "ضافت المؤتمر مجموعة مذهلة من المتحدثين الدوليين.",
    },
    {
      english: "articulate",
      arabic: "يعبر بوضوح",
      sentence:
        "She could articulate her complex ideas with remarkable clarity.",
      sentenceArabic: "يمكنها التعبير عن أفكارها المعقدة بوضوح لافت.",
    },
    {
      english: "ash",
      arabic: "رماد",
      sentence: "Volcanic ash can disrupt air travel for weeks.",
      sentenceArabic: "يمكن أن يعطل الرماد البركاني السفر الجوي لأسابيع.",
    },
    {
      english: "aspiration",
      arabic: "طموح",
      sentence:
        "His lifelong aspiration was to become a Supreme Court justice.",
      sentenceArabic:
        "كان طموحه مدى الحياة هو أن يصبح قاضياً في المحكمة العليا.",
    },
    {
      english: "aspire",
      arabic: "يطمح",
      sentence: "Many young athletes aspire to compete in the Olympics.",
      sentenceArabic:
        "يطمح العديد من الرياضيين الشباب إلى المنافسة في الألعاب الأولمبية.",
    },
    {
      english: "assassination",
      arabic: "اغتيال",
      sentence: "The assassination of the archduke triggered World War I.",
      sentenceArabic: "أدى اغتيال الأرشيدوق إلى اندلاع الحرب العالمية الأولى.",
    },
    {
      english: "assault",
      arabic: "اعتداء / هجوم",
      sentence: "The castle withstood the assault for three months.",
      sentenceArabic: "قاوم القلعة الهجوم لمدة ثلاثة أشهر.",
    },
    {
      english: "commissioner",
      arabic: "مفوض",
      sentence:
        "The police commissioner announced new crime prevention measures.",
      sentenceArabic: "أعلن مفوض الشرطة إجراءات جديدة لمنع الجريمة.",
    },
    {
      english: "commodity",
      arabic: "سلعة",
      sentence: "Oil is the country's most valuable export commodity.",
      sentenceArabic: "يعتبر النفط السلعة التصديرية الأكثر قيمة في البلاد.",
    },
    {
      english: "communist",
      arabic: "شيوعي",
      sentence: "The former communist regime was overthrown in 1989.",
      sentenceArabic: "أطيح بالنظام الشيوعي السابق في عام 1989.",
    },
    {
      english: "companion",
      arabic: "رفيق",
      sentence: "His dog was his constant companion for fifteen years.",
      sentenceArabic: "كان كلبه رفيقه الدائم لمدة خمسة عشر عاماً.",
    },
    {
      english: "comparable",
      arabic: "مماثل / قابل للمقارنة",
      sentence: "The two situations aren't remotely comparable.",
      sentenceArabic: "الموقفان ليسا قابلين للمقارنة على الإطلاق.",
    },
    {
      english: "compassion",
      arabic: "تعاطف",
      sentence: "She showed great compassion toward the victims.",
      sentenceArabic: "أظهرت تعاطفاً كبيراً towards الضحايا.",
    },
    {
      english: "compel",
      arabic: "يجبر",
      sentence: "The law compels employers to provide safe working conditions.",
      sentenceArabic: "يجبر القانون أصحاب العمل على توفير ظروف عمل آمنة.",
    },
    {
      english: "compelling",
      arabic: "مقنع / آسر",
      sentence:
        "The prosecutor presented a compelling case against the defendant.",
      sentenceArabic: "قدم المدعي العام قضية مقنعة against المتهم.",
    },
    {
      english: "compensate",
      arabic: "يعوض",
      sentence: "The company will compensate customers for the inconvenience.",
      sentenceArabic: "ستعوض الشركة العملاء عن الإزعاج.",
    },
    {
      english: "compensation",
      arabic: "تعويض",
      sentence:
        "He received substantial compensation for his wrongful dismissal.",
      sentenceArabic: "تلقى تعويضاً كبيراً عن فصله injustly.",
    },
    {
      english: "competence",
      arabic: "كفاءة",
      sentence: "Her professional competence is beyond question.",
      sentenceArabic: "كفاءتها المهنية beyond question.",
    },
    {
      english: "competent",
      arabic: "كفؤ",
      sentence: "We need to hire a competent replacement immediately.",
      sentenceArabic: "نحن بحاجة إلى توظيف بديل كفء على الفور.",
    },
    {
      english: "compile",
      arabic: "يجمع / يضم",
      sentence: "Researchers compiled data from multiple sources.",
      sentenceArabic: "جمع الباحثون البيانات من مصادر متعددة.",
    },
    {
      english: "complement",
      arabic: "يكمل",
      sentence: "The two artists' styles complement each other perfectly.",
      sentenceArabic: "أسلوبا الفنانين يكملان بعضهما البعض perfectly.",
    },
    {
      english: "complexity",
      arabic: "تعقيد",
      sentence: "I underestimated the complexity of the problem.",
      sentenceArabic: "قللت من شأن تعقيد المشكلة.",
    },
    {
      english: "compliance",
      arabic: "امتثال",
      sentence: "Strict compliance with regulations is mandatory.",
      sentenceArabic: "الامتثال الصارم لللوائح إلزامي.",
    },
    {
      english: "complication",
      arabic: "تعقيد / مضاعفة",
      sentence: "The surgery was successful with no complications.",
      sentenceArabic: "كانت الجراحة ناجحة دون مضاعفات.",
    },
    {
      english: "comply",
      arabic: "يمتثل",
      sentence: "Failure to comply will result in penalties.",
      sentenceArabic: "سيؤدي الفشل في الامتثال إلى عقوبات.",
    },
    {
      english: "composition",
      arabic: "تكوين / تأليف",
      sentence: "The chemical composition of the substance was analyzed.",
      sentenceArabic: "تم تحليل التركيب الكيميائي للمادة.",
    },
    {
      english: "compromise",
      arabic: " حل وسط",
      sentence: "A compromise was reached after lengthy negotiations.",
      sentenceArabic: "تم التوصل إلى حل وسط after مفاوضات مطولة.",
    },
    {
      english: "compute",
      arabic: "يحسب",
      sentence: "The system can compute complex equations in milliseconds.",
      sentenceArabic: "يمكن للنظام حساب المعادلات المعقدة في milliseconds.",
    },
    {
      english: "conceal",
      arabic: "يخفي",
      sentence: "He tried to conceal his true intentions.",
      sentenceArabic: "حاول إخفاء نواياه الحقيقية.",
    },
    {
      english: "concede",
      arabic: "يعترف",
      sentence: "The government conceded defeat in the election.",
      sentenceArabic: "اعترفت الحكومة بالهزيمة في الانتخابات.",
    },
    {
      english: "conceive",
      arabic: "يتصور / يبتكر",
      sentence: "It's difficult to conceive of a universe without time.",
      sentenceArabic: "من الصعب التصور of كون بدون وقت.",
    },
    {
      english: "conception",
      arabic: "تصور / مفهوم",
      sentence: "The artist's conception of the future was dystopian.",
      sentenceArabic: "كان تصور الفنان for المستقبل dystopian.",
    },
    {
      english: "concession",
      arabic: "تنازل",
      sentence: "The treaty involved significant territorial concessions.",
      sentenceArabic: "اشتملت المعاهدة on تنازلات إقليمية كبيرة.",
    },
    {
      english: "condemn",
      arabic: "يدين",
      sentence: "World leaders were quick to condemn the terrorist attack.",
      sentenceArabic: "أسرع القادة العالميون إلى إدانة الهجوم الإرهابي.",
    },
    {
      english: "confer",
      arabic: " يمنح / يتشاور",
      sentence: "The university will confer an honorary degree upon her.",
      sentenceArabic: "ستمنح الجامعة درجة فخرية uponها.",
    },
    {
      english: "confession",
      arabic: "اعتراف",
      sentence: "His confession was recorded by the police.",
      sentenceArabic: "تم تسجيل اعترافه by الشرطة.",
    },
    {
      english: "configuration",
      arabic: "تكوينة / تشكيل",
      sentence: "The new software allows for various network configurations.",
      sentenceArabic: "يسمح البرنامج الجديد by تكوينات شبكة متنوعة.",
    },
    {
      english: "confine",
      arabic: "يحصر / يقيد",
      sentence: "Please confine your comments to the topic at hand.",
      sentenceArabic: "يُرجى حصر تعليقاتك في الموضوع المطروح.",
    },
    {
      english: "confirmation",
      arabic: "تأكيد",
      sentence: "We are awaiting confirmation of the flight details.",
      sentenceArabic: "نحن في انتظار تأكيد تفاصيل الرحلة.",
    },
    {
      english: "confront",
      arabic: "يواجه",
      sentence: "She decided to confront him about the allegations.",
      sentenceArabic: "قررت مواجهته regarding الادعاءات.",
    },
    {
      english: "confrontation",
      arabic: "مواجهة",
      sentence: "The tense confrontation nearly turned violent.",
      sentenceArabic: "كادت المواجهة المتوترة أن تتحول إلى عنف.",
    },
    {
      english: "congratulate",
      arabic: "يهنئ",
      sentence: "I congratulate you on your outstanding achievement.",
      sentenceArabic: "أهنئك on إنجازك المتميز.",
    },
    {
      english: "congregation",
      arabic: "جماعة المصلين / رعية",
      sentence: "The congregation gathered for Sunday service.",
      sentenceArabic: "اجتمعت جماعة المصلين for صلاة الأحد.",
    },
    {
      english: "congressional",
      arabic: "كونغرسي",
      sentence:
        "A congressional hearing was scheduled to investigate the matter.",
      sentenceArabic: "تم جدولة جلسة استماع كونغرسية for التحقيق في الأمر.",
    },
    {
      english: "conquer",
      arabic: "يغزو / ينتصر",
      sentence: "The army set out to conquer the neighboring territories.",
      sentenceArabic: "انطلق الجيش لغزو الأراضي المجاورة.",
    },
    {
      english: "conscience",
      arabic: "ضمير",
      sentence: "His conscience wouldn't allow him to lie.",
      sentenceArabic: "لم يسمح له ضميره بالكذب.",
    },
    {
      english: "consciousness",
      arabic: "وعي",
      sentence:
        "The movement raised public consciousness about environmental issues.",
      sentenceArabic: "رفعت الحركة الوعي العام regarding القضايا البيئية.",
    },
    {
      english: "consecutive",
      arabic: "متتالي",
      sentence: "They won five consecutive championships.",
      sentenceArabic: "فازوا بخمس بطولات متتالية.",
    },
    {
      english: "consensus",
      arabic: "إجماع",
      sentence: "A general consensus emerged after the discussion.",
      sentenceArabic: "برز إجماع عام after المناقشة.",
    },
    {
      english: "consent",
      arabic: "موافقة",
      sentence: "Written consent must be obtained from all participants.",
      sentenceArabic: "يجب الحصول على موافقة خطية from جميع المشاركين.",
    },
    {
      english: "conserve",
      arabic: "يحافظ / يحفظ",
      sentence: "We must conserve water during the drought.",
      sentenceArabic: "يجب علينا الحفاظ on المياه during الجفاف.",
    },
    {
      english: "consistency",
      arabic: "اتساق",
      sentence: "The consistency of his performance is remarkable.",
      sentenceArabic: "اتساق أدائه remarkable.",
    },
    {
      english: "consolidate",
      arabic: "يدمج / يرسخ",
      sentence: "The company plans to consolidate its operations.",
      sentenceArabic: "تخطط الشركة لدمج عملياتها.",
    },
    {
      english: "constituency",
      arabic: "دائرة انتخابية / ناخبون",
      sentence: "She represents a rural constituency in parliament.",
      sentenceArabic: "تمثل دائرة انتخابية ريفية in البرلمان.",
    },
    {
      english: "constitute",
      arabic: "يشكل",
      sentence: "These actions constitute a breach of contract.",
      sentenceArabic: "تشكل هذه الإجراءات خرقاً للعقد.",
    },
    {
      english: "constitution",
      arabic: "دستور",
      sentence: "The right to free speech is protected by the constitution.",
      sentenceArabic: "يحمي الدستور الحق في حرية التعبير.",
    },
    {
      english: "constitutional",
      arabic: "دستوري",
      sentence:
        "The court will rule on the constitutional validity of the law.",
      sentenceArabic: "ستحكم المحكمة on الشرعية الدستورية للقانون.",
    },
    {
      english: "constraint",
      arabic: "قيد",
      sentence: "Budgetary constraints limited the project's scope.",
      sentenceArabic: "قيود budgetية limited نطاق المشروع.",
    },
    {
      english: "drift",
      arabic: "انجراف",
      sentence: "The boat began to drift toward the rocks.",
      sentenceArabic: "بدأ القارب ينجرف towards الصخور.",
    },
    {
      english: "driving",
      arabic: "قيادة",
      sentence: "Driving under the influence is a serious offense.",
      sentenceArabic: "القيادة under تأثير المخدرات جريمة خطيرة.",
    },
    {
      english: "drown",
      arabic: "يغرق",
      sentence: "He nearly drowned when he was caught in a strong current.",
      sentenceArabic: "كاد أن يغرق when وقع في تيار قوي.",
    },
    {
      english: "dual",
      arabic: "مزدوج",
      sentence: "She holds dual citizenship in Canada and France.",
      sentenceArabic: "تحمل جنسية مزدوجة in كندا وفرنسا.",
    },
    {
      english: "dub",
      arabic: "يدبلج / يلقب",
      sentence: "The film was dubbed into over twenty languages.",
      sentenceArabic: "تم دبلجة الفيلم to أكثر من عشرين لغة.",
    },
    {
      english: "dumb",
      arabic: "أبكم / غبي",
      sentence: "That was a dumb mistake to make.",
      sentenceArabic: "كان هذا خطأً غبياً.",
    },
    {
      english: "duo",
      arabic: "ثنائي",
      sentence: "The musical duo released their debut album last year.",
      sentenceArabic: "أصدر الثنائي الموسيقي ألبومه الأول last year.",
    },
    {
      english: "dynamic",
      arabic: "ديناميكي",
      sentence: "The dynamic between the two leaders was fascinating.",
      sentenceArabic: "كانت الديناميكية between القائدين fascinating.",
    },
    {
      english: "eager",
      arabic: "متحمس",
      sentence: "The team was eager to begin the new project.",
      sentenceArabic: "كان الفريق متحمساً for بدء المشروع الجديد.",
    },
    {
      english: "earnings",
      arabic: "أرباح / دخل",
      sentence: "The company's quarterly earnings exceeded expectations.",
      sentenceArabic: "تجاوزت أرباح الشركة quarterly التوقعات.",
    },
    {
      english: "ease",
      arabic: "يخفف / يسهل",
      sentence: "The medicine should ease the pain within minutes.",
      sentenceArabic: "ينبغي للدواء أن يخفف الألم within دقائق.",
    },
    {
      english: "echo",
      arabic: "صدى",
      sentence: "Her words found an echo in the hearts of many.",
      sentenceArabic: "وجدت كلماتها صدى in قلوب الكثيرين.",
    },
    {
      english: "ecological",
      arabic: "بيئي",
      sentence: "The ecological impact of the disaster was devastating.",
      sentenceArabic: "كان التأثير البيئي للكارثة devastating.",
    },
    {
      english: "educator",
      arabic: "مربي / معلم",
      sentence: "She was a respected educator for over forty years.",
      sentenceArabic: "كانت مربية محترمة for أكثر من أربعين عاماً.",
    },
    {
      english: "effectiveness",
      arabic: "فعالية",
      sentence: "The effectiveness of the new policy is still being evaluated.",
      sentenceArabic: "لا تزال فعالية السياسة الجديدة being يتم تقييمها.",
    },
    {
      english: "efficiency",
      arabic: "كفاءة",
      sentence: "The new system improved operational efficiency by 30%.",
      sentenceArabic: "حسن النظام الجديد الكفاءة التشغيلية by 30%.",
    },
    {
      english: "ego",
      arabic: "أنا",
      sentence: "His enormous ego often got him into trouble.",
      sentenceArabic: "كثيراً ما أوقعته أناه الهائلة في المشاكل.",
    },
    {
      english: "elaborate",
      arabic: "مفصل / يعقد",
      sentence: "She elaborated on her initial proposal during the meeting.",
      sentenceArabic: "أوضحت اقتراحها الأولي during الاجتماع.",
    },
    {
      english: "electoral",
      arabic: "انتخابي",
      sentence: "Electoral reform is a major topic of debate.",
      sentenceArabic: "الإصلاح الانتخابي هو موضوع نقاش رئيسي.",
    },
    {
      english: "elevate",
      arabic: "يرفع",
      sentence: "The promotion elevated him to a senior management position.",
      sentenceArabic: "رفعه الترقية to منصب إداري رفيع.",
    },
    {
      english: "eligible",
      arabic: "مؤهل",
      sentence: "Are you eligible to vote in the upcoming election?",
      sentenceArabic: "هل أنت مؤهل للتصويت in الانتخابات القادمة؟",
    },
    {
      english: "elite",
      arabic: "نخبة",
      sentence: "The school caters to the children of the political elite.",
      sentenceArabic: "تخدم المدرسة أطفال النخبة السياسية.",
    },
    {
      english: "embark",
      arabic: "يشرع",
      sentence: "They will embark on a new venture next month.",
      sentenceArabic: "سوف يشرعون في مشروع جديد next month.",
    },
    {
      english: "embarrassment",
      arabic: "إحراج",
      sentence: "To her embarrassment, she forgot his name.",
      sentenceArabic: "لإحراجها، نسيت اسمه.",
    },
    {
      english: "embassy",
      arabic: "سفارة",
      sentence: "The American embassy issued a travel warning.",
      sentenceArabic: "أصدرت السفارة الأمريكية تحذيراً سفراً.",
    },
    {
      english: "embed",
      arabic: "يدمج / يغرس",
      sentence: "The journalist was embedded with an army unit.",
      sentenceArabic: "تم دمج الصحفي with وحدة عسكرية.",
    },
    {
      english: "embody",
      arabic: "يجسد",
      sentence: "She embodies the values of our organization.",
      sentenceArabic: "إنها تجسد قيم منظمتنا.",
    },
    {
      english: "emergence",
      arabic: "بروز / ظهور",
      sentence: "The emergence of new technologies transformed the industry.",
      sentenceArabic: "حول بروز التقنيات الجديدة الصناعة.",
    },
    {
      english: "empirical",
      arabic: "تجريبي",
      sentence: "The theory lacks empirical evidence.",
      sentenceArabic: "تفتقر النظرية إلى أدلة تجريبية.",
    },
    {
      english: "empower",
      arabic: "يمكن",
      sentence: "Education empowers people to improve their lives.",
      sentenceArabic: "يمكن التعليم الناس from تحسين حياتهم.",
    },
    {
      english: "enact",
      arabic: "يسن",
      sentence: "Parliament enacted a new law on data privacy.",
      sentenceArabic: "سن البرلمان قانوناً جديداً regarding خصوصية البيانات.",
    },
    {
      english: "encompass",
      arabic: "يضم",
      sentence: "The report encompasses all aspects of the problem.",
      sentenceArabic: "يضم التقرير جميع جوانب المشكلة.",
    },
    {
      english: "encouragement",
      arabic: "تشجيع",
      sentence: "His teacher's encouragement meant a lot to him.",
      sentenceArabic: "عنى تشجيع معلمه الكثير له.",
    },
    {
      english: "encouraging",
      arabic: "مشجع",
      sentence: "The early results are very encouraging.",
      sentenceArabic: "النتائج المبكرة مشجعة جداً.",
    },
    {
      english: "endeavour",
      arabic: "مسعى / يحاول",
      sentence: "The scientific endeavour yielded groundbreaking discoveries.",
      sentenceArabic: "أدى المسعى العلمي إلى اكتشافات groundbreaking.",
    },
    {
      english: "endless",
      arabic: "لا نهائي",
      sentence: "The meeting seemed endless.",
      sentenceArabic: "بدا الاجتماع لا نهائياً.",
    },
    {
      english: "endorse",
      arabic: "يوافق / يؤيد",
      sentence: "I cannot endorse a plan I consider flawed.",
      sentenceArabic: "لا يمكنني تأييد خطة أعتبرها معيبة.",
    },
    {
      english: "endorsement",
      arabic: "تأييد / موافقة",
      sentence: "The product received a celebrity endorsement.",
      sentenceArabic: "تلقى المنتج تأييداً من مشهور.",
    },
    {
      english: "endure",
      arabic: " يتحمل / يدوم",
      sentence: "She endured tremendous hardship with grace.",
      sentenceArabic: "تحملت صعوبة tremendous بكل نعومة.",
    },
    {
      english: "enforce",
      arabic: "يفرض",
      sentence: "It is difficult to enforce the new regulations.",
      sentenceArabic: "من الصعب فرض اللوائح الجديدة.",
    },
    {
      english: "enforcement",
      arabic: "إنفاذ",
      sentence: "Strict enforcement of the rules is necessary.",
      sentenceArabic: "إنفاذ صارم للقواعد necessary.",
    },
    {
      english: "engagement",
      arabic: "ارتباط / مشاركة",
      sentence:
        "The company announced its engagement in a new sustainability initiative.",
      sentenceArabic: "أعلنت الشركة عن مشاركتها في مبادرة جديدة للاستدامة.",
    },
    {
      english: "engaging",
      arabic: "جذاب / شائق",
      sentence:
        "The professor delivered an engaging lecture that captivated the entire audience.",
      sentenceArabic: "قدم المحاضر محاضرة شيقة أسرت انتباه الجميع.",
    },
    {
      english: "enquire",
      arabic: "يستفسر",
      sentence:
        "I need to enquire about the application deadline for the scholarship.",
      sentenceArabic:
        "أحتاج إلى الاستفسار عن الموعد النهائي للتقديم على المنحة الدراسية.",
    },
    {
      english: "enrich",
      arabic: "يثري",
      sentence:
        "Traveling to different countries can significantly enrich one's cultural understanding.",
      sentenceArabic:
        "يمكن للسفر إلى دول مختلفة أن يثري بشكل كبير الفهم الثقافي للفرد.",
    },
    {
      english: "enrol",
      arabic: "يسجل",
      sentence:
        "Students must enrol in the course before the end of the add/drop period.",
      sentenceArabic:
        "يجب على الطلاب التسجيل في المقرر قبل نهاية فترة الإضافة والحذف.",
    },
    {
      english: "ensue",
      arabic: "يتبع / ينتج",
      sentence:
        "Chaos ensued after the unexpected announcement of the policy change.",
      sentenceArabic: "تبع الفوضى الإعلان غير المتوقع عن تغيير السياسة.",
    },
    {
      english: "enterprise",
      arabic: "مشروع / مؤسسة",
      sentence:
        "His latest enterprise involves developing renewable energy solutions for rural areas.",
      sentenceArabic:
        "مشروعه الأخير involves تطوير حلول الطاقة المتجددة للمناطق الريفية.",
    },
    {
      english: "enthusiast",
      arabic: "هواة / مُغْرَم",
      sentence:
        "As a photography enthusiast, he spends every weekend capturing landscapes.",
      sentenceArabic:
        "كهاوٍ للتصوير، يقضي كل عطلة الأسبوع في التقاط المناظر الطبيعية.",
    },
    {
      english: "entitle",
      arabic: "يخوّل / يعطي الحق",
      sentence: "This ticket entitles you to a complimentary drink at the bar.",
      sentenceArabic: "هذه التذكرة تخوّلك الحصول على مشروب مجاني at البار.",
    },
    {
      english: "heritage",
      arabic: "تراث",
      sentence:
        "The government allocated funds for the preservation of the nation's cultural heritage.",
      sentenceArabic: "خصصت الحكومة أموالاً للحفاظ على التراث الثقافي للأمة.",
    },
    {
      english: "hierarchy",
      arabic: "تسلسل هرمي",
      sentence:
        "The corporate hierarchy was clearly defined in the organizational chart.",
      sentenceArabic:
        "كان التسلسل الهرمي للشركة مُعرّفًا بوضوح في المخطط التنظيمي.",
    },
    {
      english: "high-profile",
      arabic: "ملحوظ / بارز",
      sentence:
        "The lawyer took on several high-profile cases that attracted media attention.",
      sentenceArabic: "تولى المحامي عدة قضايا بارزة جذبت اهتمام وسائل الإعلام.",
    },
    {
      english: "hint",
      arabic: "تلميح / إشارة",
      sentence:
        "She dropped a subtle hint about her upcoming promotion during dinner.",
      sentenceArabic:
        "ألقت تلميحًا خفيفًا about ترقيتها القادمة during العشاء.",
    },
    {
      english: "homeland",
      arabic: "وطن",
      sentence:
        "After years abroad, he felt a strong longing to return to his homeland.",
      sentenceArabic: "بعد سنوات في الخارج، شعر بشوق شديد للعودة إلى وطنه.",
    },
    {
      english: "hook",
      arabic: "خطّاف / يعلق",
      sentence:
        "The novel's opening chapter had a hook that immediately captured my interest.",
      sentenceArabic:
        "كان للفصل الافتتاحي للرواية خطاف ا captured اهتمامي على الفور.",
    },
    {
      english: "hopeful",
      arabic: "متفائل",
      sentence:
        "Despite the challenges, she remained hopeful about the future.",
      sentenceArabic: "على الرغم من التحديات، ظلت متفائلة بشأن المستقبل.",
    },
    {
      english: "horizon",
      arabic: "أفق",
      sentence:
        "New opportunities appeared on the horizon after he completed his degree.",
      sentenceArabic: "ظهرت فرص جديدة على الأفق after أنهى درجة علمية.",
    },
    {
      english: "horn",
      arabic: "بوق / قرن",
      sentence:
        "The sound of car horns filled the busy streets during rush hour.",
      sentenceArabic:
        "امتلأت الشوارع المزدحمة during ساعة الذروة ب صوت أبواق السيارات.",
    },
    {
      english: "hostage",
      arabic: "رهينة",
      sentence:
        "The negotiators worked tirelessly to secure the release of the hostages.",
      sentenceArabic: "عمل المفاوضون without كلل to تأمين إطلاق سراح الرهائن.",
    },
    {
      english: "hostile",
      arabic: "معاد",
      sentence:
        "The entrepreneur faced a hostile takeover attempt from a rival company.",
      sentenceArabic:
        "واجه رائد الأعمال محاولة استحواذ معادية from شركة منافسة.",
    },
    {
      english: "hostility",
      arabic: "عداء",
      sentence:
        "There was palpable hostility between the two competing factions.",
      sentenceArabic: "كان هناك عداء ملموس between الفصيلين المتنافسين.",
    },
    {
      english: "humanitarian",
      arabic: "إنساني",
      sentence: "The organization provides humanitarian aid to conflict zones.",
      sentenceArabic: "تقدم المنظمة مساعدات إنسانية to مناطق النزاع.",
    },
    {
      english: "humanity",
      arabic: "إنسانية",
      sentence:
        "The disaster brought out the best in humanity, with people helping strangers selflessly.",
      sentenceArabic:
        "أبرزت الكارثة أفضل ما في الإنسانية، حيث ساعد الناس الغرباء without أنانية.",
    },
    {
      " english": "humble",
      arabic: "متواضع",
      sentence: "Despite his immense wealth, he remained humble and grounded.",
      sentenceArabic: "على الرغم من ثروته الهائلة، ظل متواضعًا ومتزناً.",
    },
    {
      english: "hydrogen",
      arabic: "هيدروجين",
      sentence:
        "Green hydrogen is seen as a promising clean energy source for the future.",
      sentenceArabic:
        "يُعد الهيدروجين الأخضر مصدرًا واعدًا للطاقة النظيفة for المستقبل.",
    },
    {
      english: "identification",
      arabic: "تعريف / تحديد هوية",
      sentence: "You need two forms of identification to open a bank account.",
      sentenceArabic: "تحتاج إلى نموذجين من إثبات الشخصية to فتح حساب بنكي.",
    },
    {
      english: "ideological",
      arabic: "أيديولوجي",
      sentence:
        "The split within the party was primarily ideological rather than personal.",
      sentenceArabic:
        "كان الانقسام داخل الحزب أيديولوجيًا في المقام الأول rather than شخصيًا.",
    },
    {
      english: "ideology",
      arabic: "أيديولوجيا",
      sentence:
        "His political ideology influenced every decision he made in office.",
      sentenceArabic: "أثرت أيديولوجيته السياسية on every قرار اتخذه في منصبه.",
    },
    {
      english: "idiot",
      arabic: "أحمق",
      sentence:
        "He felt like an idiot for forgetting his own wedding anniversary.",
      sentenceArabic: "شعر بأنه أحمق for نسيانه ذكرى زواجه.",
    },
    {
      english: "ignorance",
      arabic: "جهل",
      sentence: "The policy was born out of ignorance rather than malice.",
      sentenceArabic: "وُلدت السياسة from الجهل rather than الحقد.",
    },
    {
      english: "imagery",
      arabic: "صور / تخيل",
      sentence:
        "The poet's use of vivid imagery transported the readers to another world.",
      sentenceArabic: "نقل استخدام الشاعر للصور الواضحة القراء to عالم آخر.",
    },
    {
      english: "immense",
      arabic: "هائل",
      sentence:
        "The project required an immense amount of planning and resources.",
      sentenceArabic: "تطلب المشروع قدرًا هائلاً من التخطيط والموارد.",
    },
    {
      english: "imminent",
      arabic: "وشيك",
      sentence: "The dark clouds suggested that a storm was imminent.",
      sentenceArabic: "أشارت السحب الداكنة إلى أن عاصفة كانت وشيكة.",
    },
    {
      english: "implementation",
      arabic: "تنفيذ",
      sentence:
        "The successful implementation of the new software took six months.",
      sentenceArabic: "استغرق التنفيذ الناجح للبرنامج الجديد ستة أشهر.",
    },
    {
      english: "imprison",
      arabic: "يسجن",
      sentence:
        "The court decided to imprison the activist for his political views.",
      sentenceArabic: "قررت المحكمة سجن الناشط due to آرائه السياسية.",
    },
    {
      english: "imprisonment",
      arabic: "سجن",
      sentence: "He faced a lengthy imprisonment if convicted of the charges.",
      sentenceArabic: "واجه سجنًا طويلاً if إدانته بال تهم.",
    },
    {
      english: "inability",
      arabic: "عدم قدرة",
      sentence:
        "His inability to delegate tasks was a major weakness as a manager.",
      sentenceArabic:
        "كانت عدم قدرته على تفويض المهام weaknessًا كبيرًا كمدير.",
    },
    {
      english: "inadequate",
      arabic: "غير كاف",
      sentence: "The emergency response was criticized for being inadequate.",
      sentenceArabic: "تم انتقاد الاستجابة للطوارئ for كونها غير كافية.",
    },
    {
      english: "inappropriate",
      arabic: "غير لائق",
      sentence: "His comments during the meeting were highly inappropriate.",
      sentenceArabic: "كانت تعليقاته during الاجتماع غير لائقة للغاية.",
    },
    {
      english: "incidence",
      arabic: "حدوث / انتشار",
      sentence:
        "There has been a sharp increase in the incidence of cybercrime.",
      sentenceArabic: "كانت هناك زيادة حادة في حدوث الجرائم الإلكترونية.",
    },
    {
      english: "engagement",
      arabic: "ارتباط / مشاركة",
      sentence:
        "The company announced its engagement in a new environmental sustainability initiative.",
      sentenceArabic:
        "أعلنت الشركة عن مشاركتها في مبادرة جديدة للاستدامة البيئية.",
    },
    {
      english: "engaging",
      arabic: "جذاب / شيق",
      sentence:
        "The professor delivered an engaging lecture that captivated the entire audience.",
      sentenceArabic: "قدم المحاضر محاضرة شيقة أسرت الجميع.",
    },
    {
      english: "enquire",
      arabic: "يستفسر",
      sentence:
        "I need to enquire about the application deadline for the scholarship program.",
      sentenceArabic:
        "أحتاج إلى الاستفسار عن الموعد النهائي للتقديم على برنامج المنحة الدراسية.",
    },
    {
      english: "enrich",
      arabic: "يثري",
      sentence:
        "The cultural exchange program aims to enrich students' understanding of global perspectives.",
      sentenceArabic:
        "يهدف برنامج التبادل الثقافي إلى إثراء فهم الطلاب للوجهات العالمية.",
    },
    {
      english: "enrol",
      arabic: "يسجل",
      sentence:
        "Students must enrol in the advanced course before the end of the registration period.",
      sentenceArabic:
        "يجب على الطلاب التسجيل في الدورة المتقدمة قبل نهاية فترة التسجيل.",
    },
    {
      english: "ensue",
      arabic: "يتبع / ينتج",
      sentence:
        "Chaos ensued after the unexpected announcement of the policy changes.",
      sentenceArabic: "تبع الفوضى الإعلان غير المتوقع عن تغييرات السياسة.",
    },
    {
      english: "enterprise",
      arabic: "مشروع / مؤسسة",
      sentence:
        "The new enterprise focuses on developing innovative renewable energy solutions.",
      sentenceArabic:
        "تركز المؤسسة الجديدة على تطوير حلول مبتكرة للطاقة المتجددة.",
    },
    {
      english: "enthusiast",
      arabic: "هواة / مُغْرَم",
      sentence:
        "As a photography enthusiast, she spent hours capturing the perfect sunset shot.",
      sentenceArabic:
        "كهاوية للتصوير، قضت ساعات في التقاط لقطة الغروب المثالية.",
    },
    {
      english: "entitle",
      arabic: "يخوّل / يعطي الحق",
      sentence:
        "This document entitles the bearer to access the restricted archives.",
      sentenceArabic: "هذه الوثيقة تخوّل حاملها الوصول إلى الأرشيف المقيد.",
    },
    {
      english: "heritage",
      arabic: "تراث",
      sentence:
        "The government has implemented measures to protect the nation's cultural heritage.",
      sentenceArabic:
        "قامت الحكومة بتنفيذ إجراءات لحماية التراث الثقافي للأمة.",
    },
    {
      english: "hierarchy",
      arabic: "تسلسل هرمي",
      sentence:
        "The corporate hierarchy was restructured to improve operational efficiency.",
      sentenceArabic:
        "أعيد هيكلة التسلسل الهرمي للشركة لتحسين الكفاءة التشغيلية.",
    },
    {
      english: "high-profile",
      arabic: "بارز / مهم",
      sentence:
        "The lawyer took on several high-profile cases that gained media attention.",
      sentenceArabic: "تولى المحامي عدة قضايا مهمة حظيت باهتمام إعلامي.",
    },
    {
      english: "hint",
      arabic: "تلميح / إشارة",
      sentence:
        "She dropped a subtle hint about the surprise party during our conversation.",
      sentenceArabic: "ألقت تلميحًا خفيفًا عن حفلة المفاجأة خلال محادثتنا.",
    },
    {
      english: "homeland",
      arabic: "وطن",
      sentence:
        "After years abroad, he returned to his homeland with renewed perspective.",
      sentenceArabic: "بعد سنوات في الخارج، عاد إلى وطنه بتصور متجدد.",
    },
    {
      english: "hook",
      arabic: "خطاف / شي جذاب",
      sentence:
        "The novel's opening hook immediately captured the readers' attention.",
      sentenceArabic:
        "استولى الخطاف الافتتاحي للرواية على انتباه القراء فورًا.",
    },
    {
      english: "hopeful",
      arabic: "متفائل",
      sentence:
        "Despite the challenges, she remained hopeful about the project's success.",
      sentenceArabic: "على الرغم من التحديات، ظلت متفائلة بنجاح المشروع.",
    },
    {
      english: "horizon",
      arabic: "أفق",
      sentence:
        "New opportunities appeared on the horizon as the market began to recover.",
      sentenceArabic: "ظهرت فرص جديدة في الأفق مع بدء تعافي السوق.",
    },
    {
      english: "horn",
      arabic: "بوق / قرن",
      sentence:
        "The sound of car horns filled the busy city streets during rush hour.",
      sentenceArabic:
        "ملأ صوت أبواق السيارات شوارع المدينة المزدحمة during ساعة الذروة.",
    },
    {
      english: "hostage",
      arabic: "رهينة",
      sentence:
        "The negotiators worked tirelessly to secure the release of the hostages.",
      sentenceArabic: "عمل المفاوضون بدون كلل لتأمين إطلاق سراح الرهائن.",
    },
    {
      english: "hostile",
      arabic: "عدائي",
      sentence:
        "The environment became increasingly hostile as tensions escalated.",
      sentenceArabic: "أصبح البيئة increasingly عدائية مع تصاعد التوترات.",
    },
    {
      english: "hostility",
      arabic: "عداء",
      sentence:
        "There was palpable hostility between the two rival factions during the meeting.",
      sentenceArabic:
        "كان هناك عداء محسوس between الفصيلين المتنافسين during الاجتماع.",
    },
    {
      english: "humanitarian",
      arabic: "إنساني",
      sentence:
        "International humanitarian organizations provided aid to the disaster-stricken region.",
      sentenceArabic:
        "قدمت المنظمات الإنسانية الدولية المساعدة إلى المنطقة المنكوبة.",
    },
    {
      english: "humanity",
      arabic: "إنسانية / بشر",
      sentence:
        "The crisis brought out both the best and worst aspects of humanity.",
      sentenceArabic: "أبرزت الأزمة كلاً من أفضل وأسوأ جوانب الإنسانية.",
    },
    {
      english: "humble",
      arabic: "متواضع",
      sentence:
        "Despite his achievements, he remained remarkably humble about his success.",
      sentenceArabic:
        "على الرغم من إنجازاته، ظل متواضعًا بشكل ملحوظ regarding نجاحه.",
    },
    {
      english: "hydrogen",
      arabic: "هيدروجين",
      sentence:
        "Scientists are exploring hydrogen as a potential clean energy source for the future.",
      sentenceArabic:
        "يستكشف العلماء الهيدروجين as مصدر محتمل للطاقة النظيفة for المستقبل.",
    },
    {
      english: "identification",
      arabic: "تعريف / تحديد",
      sentence:
        "Proper identification is required for access to the secure facility.",
      sentenceArabic: "التعريف السليم مطلوب for الوصول إلى المنشأة الآمنة.",
    },
    {
      english: "ideological",
      arabic: "أيديولوجي",
      sentence:
        "The conflict was driven by deep ideological differences between the two groups.",
      sentenceArabic:
        "كان الصراع driven by اختلافات أيديولوجية عميقة between المجموعتين.",
    },
    {
      english: "ideology",
      arabic: "أيديولوجيا",
      sentence:
        "His political ideology influenced all aspects of his decision-making process.",
      sentenceArabic:
        "أثرت أيديولوجيته السياسية على جميع جوانب عملية اتخاذ القرار.",
    },
    {
      english: "idiot",
      arabic: "أحمق",
      sentence:
        "Only an idiot would ignore the clear warnings about the impending storm.",
      sentenceArabic:
        "只有 الأحمق سيتجاهل التحذيرات الواضحة about العاصفة الوشيكة.",
    },
    {
      english: "ignorance",
      arabic: "جهل",
      sentence:
        "The policy was implemented out of sheer ignorance of the local cultural context.",
      sentenceArabic: "نُفذت السياسة out of جهل صريح بالسياق الثقافي المحلي.",
    },
  ],
};

// --- بيانات المنهج الدراسي الجديد ---
const CURRICULUM_DATA = [
  {
    id: 1,
    title: "Nice to meet you!",
    level: "A1",
    content: [
      {
        type: "dialogue",
        title: "Introducing Yourself",
        lines: [
          { speaker: "John", text: "Hello. My name is John Rollings." },
          { speaker: "Maria", text: "I'm Maria Santos. Nice to meet you." },
          {
            speaker: "John",
            text: "Nice to meet you, too, Ms. Santos. Where are you from?",
          },
          { speaker: "Maria", text: "I'm from Los Angeles. And you?" },
          { speaker: "John", text: "I'm from Boston." },
        ],
      },
      {
        type: "vocabulary",
        title: "Countries, Cities, Nationalities",
        words: [
          { english: "Washington", arabic: "واشنطن" },
          { english: "England", arabic: "إنجلترا" },
          { english: "Rio de Janeiro", arabic: "ريو دي جانيرو" },
          { english: "Japanese", arabic: "ياباني" },
        ],
      },
      {
        type: "grammar",
        title: 'Simple Present "to be"',
        explanation:
          'Use the verb "to be" (am, is, are) to talk about names, origins, and descriptions.',
        examples: [
          "I am from Boston.",
          "She is from Los Angeles.",
          "Are you from New York? Yes, I am.",
        ],
      },
      {
        type: "exercise",
        title: "Practice",
        question: "Where is Maria from?",
        options: ["Boston", "Los Angeles", "New York"],
        correctAnswer: "Los Angeles",
      },
    ],
  },
  {
    id: 2,
    title: "I'd like the steak, please.",
    level: "A1",
    content: [
      {
        type: "dialogue",
        title: "Ordering in a restaurant",
        lines: [
          { speaker: "Waiter", text: "What would you like for dinner?" },
          { speaker: "Mrs. Miller", text: "I'd like the steak, please." },
          { speaker: "Waiter", text: "And for you, sir?" },
          {
            speaker: "Mr. Miller",
            text: "I'd like the chicken with rice, please.",
          },
          { speaker: "Waiter", text: "Right away." },
        ],
      },
      {
        type: "vocabulary",
        title: "Food and Drinks",
        words: [
          { english: "steak", arabic: "شريحة لحم" },
          { english: "chicken", arabic: "دجاج" },
          { english: "rice", arabic: "أرز" },
          { english: "hamburger", arabic: "همبرغر" },
        ],
      },
      {
        type: "exercise",
        title: "Practice",
        question: "What would Mrs. Miller like?",
        options: ["Chicken", "Hamburger", "Steak"],
        correctAnswer: "Steak",
      },
    ],
  },
];

// --- بيانات القصص الجديدة ---
const STORIES = [
  {
    level: "A1",
    title: "The Red Ball",
    content:
      "This is a ball. The ball is red. I like the red ball. I play with the ball. It is fun.",
  },
  {
    level: "A1",
    title: "My Cat",
    content:
      "I have a cat. My cat is black. My cat likes to sleep. I love my cat.",
  },
  {
    level: "A2",
    title: "A Day at the Beach",
    content:
      "Yesterday, my family and I went to the beach. The sun was hot. We played in the water. We built a big sandcastle. It was a happy day.",
  },
  {
    level: "A2",
    title: "My Friend Ali",
    content:
      "My friend is Ali. He is a student. He likes to read books. After school, we play football in the park.",
  },
  {
    level: "B1",
    title: "The New Restaurant",
    content:
      "A new restaurant opened in our city last month. It serves Italian food. I went there with my friends to celebrate my birthday. The service was excellent and the food was delicious. I think I will go there again soon.",
  },
  {
    level: "B1",
    title: "Planning a Trip",
    content:
      "My friends and I are planning a trip to another country. We need to decide where to go. We also need to check the price of flights and hotels. It is a lot of work, but we are very excited about the trip.",
  },
];

// --- بيانات القواعد النحوية الجديدة ---
const GRAMMAR_DATA = [
  {
    level: "A1",
    rules: [
      {
        title: 'Simple Present: "to be"',
        explanation:
          'نستخدم الفعل "to be" (am, is, are) للحديث عن الأسماء، الأصول، والصفات.',
        examples: [
          { english: "I am a student.", arabic: "أنا طالب." },
          { english: "She is from Egypt.", arabic: "هي من مصر." },
          { english: "They are happy.", arabic: "هم سعداء." },
        ],
        questions: [
          {
            questionEnglish: "She ___ a doctor.",
            questionArabic: "هي ___ طبيبة.",
            options: ["am", "is", "are"],
            correctAnswer: "is",
          },
          {
            questionEnglish: "We ___ friends.",
            questionArabic: "نحن ___ أصدقاء.",
            options: ["am", "is", "are"],
            correctAnswer: "are",
          },
        ],
      },
      {
        title: "Articles: a/an",
        explanation:
          'نستخدم "a" قبل الكلمات التي تبدأ بصوت ساكن، و "an" قبل الكلمات التي تبدأ بصوت متحرك.',
        examples: [
          { english: "This is a book.", arabic: "هذا كتاب." },
          { english: "That is an apple.", arabic: "تلك تفاحة." },
        ],
        questions: [
          {
            questionEnglish: "I have ___ new car.",
            questionArabic: "لدي ___ سيارة جديدة.",
            options: ["a", "an", "the"],
            correctAnswer: "a",
          },
          {
            english: "She is ___ engineer.",
            questionArabic: "هي ___ مهندسة.",
            options: ["a", "an", "the"],
            correctAnswer: "an",
          },
        ],
      },
    ],
  },
  {
    level: "A2",
    rules: [
      {
        title: "Simple Past Tense",
        explanation:
          'نستخدم الماضي البسيط للحديث عن أحداث مكتملة في الماضي. نضيف "-ed" للأفعال المنتظمة.',
        examples: [
          {
            english: "I watched a movie yesterday.",
            arabic: "شاهدت فيلماً أمس.",
          },
          {
            english: "She visited her grandmother last week.",
            arabic: "زارت جدتها الأسبوع الماضي.",
          },
        ],
        questions: [
          {
            questionEnglish: "He ___ football with his friends.",
            questionArabic: "هو ___ كرة القدم مع أصدقائه.",
            options: ["play", "plays", "played"],
            correctAnswer: "played",
          },
          {
            english: "They ___ to the museum.",
            questionArabic: "هم ___ إلى المتحف.",
            options: ["go", "went", "gone"],
            correctAnswer: "went",
          },
        ],
      },
    ],
  },
];

// --- بيانات البودكاست الجديدة ---
const PODCASTS_DATA = [
  {
    level: "A1",
    episodes: [
      {
        title: "Greetings and Introductions",
        description:
          "Learn how to say hello and introduce yourself in English.",
        audioUrl: "#",
      },
      {
        title: "Numbers and Colors",
        description: "Practice numbers from 1 to 20 and basic colors.",
        audioUrl: "#",
      },
    ],
  },
  {
    level: "A2",
    episodes: [
      {
        title: "Ordering Food in a restaurant",
        description: "Listen to a simple conversation at a restaurant.",
        audioUrl: "#",
      },
      {
        title: "Talking About Your Hobbies",
        description:
          "Learn how to talk about what you like to do in your free time.",
        audioUrl: "#",
      },
    ],
  },
];

// --- بيانات الإنجازات الجديدة ---
const ACHIEVEMENTS_DATA = [
  {
    id: "beginner",
    title: "المبتدئ",
    description: "تعلم 10 كلمات",
    goal: 10,
    icon: "fa-star",
  },
  {
    id: "persistent",
    title: "المثابر",
    description: "تعلم 50 كلمة",
    goal: 50,
    icon: "fa-fire",
  },
  {
    id: "expert",
    title: "الخبير",
    description: "تعلم 100 كلمة",
    goal: 100,
    icon: "fa-crown",
  },
  {
    id: "first_lesson",
    title: "الدرس الأول",
    description: "أكمل أول درس لك",
    goal: 1,
    icon: "fa-book-open",
  },
];

// دالة تحويل PCM إلى WAV
const pcmToWav = (pcmData, sampleRate) => {
  const dataView = new DataView(new ArrayBuffer(44 + pcmData.byteLength));
  let offset = 0;

  dataView.setUint32(offset, 1380533830, false);
  offset += 4;
  dataView.setUint32(offset, 36 + pcmData.byteLength, true);
  offset += 4;
  dataView.setUint32(offset, 1463899717, false);
  offset += 4;

  dataView.setUint32(offset, 1718449184, false);
  offset += 4;
  dataView.setUint32(offset, 16, true);
  offset += 4;
  dataView.setUint16(offset, 1, true);
  offset += 2;
  dataView.setUint16(offset, 1, true);
  offset += 2;
  dataView.setUint32(offset, sampleRate, true);
  offset += 4;
  dataView.setUint32(offset, sampleRate * 2, true);
  offset += 4;
  dataView.setUint16(offset, 2, true);
  offset += 2;
  dataView.setUint16(offset, 16, true);
  offset += 2;

  dataView.setUint32(offset, 1684108385, false);
  offset += 4;
  dataView.setUint32(offset, pcmData.byteLength, true);
  offset += 4;

  const pcm16 = new Int16Array(pcmData);
  for (let i = 0; i < pcm16.length; i++) {
    dataView.setInt16(offset, pcm16[i], true);
    offset += 2;
  }
  return new Blob([dataView], { type: "audio/wav" });
};

// دالة تحويل base64 إلى ArrayBuffer
const base64ToArrayBuffer = (base64) => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// إعدادات API
const API_KEY = "";
const TTS_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${API_KEY}`;
const TEXT_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;
const VOICE_NAME = "Kore";

// دالة استدعاء Gemini API للنصوص
const generateText = async (prompt) => {
  const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
  try {
    const response = await fetch(TEXT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    if (
      result.candidates &&
      result.candidates.length > 0 &&
      result.candidates[0].content &&
      result.candidates[0].content.parts &&
      result.candidates[0].content.parts.length > 0
    ) {
      return result.candidates[0].content.parts[0].text;
    } else {
      console.error("Unexpected API response structure:", result);
      return "لم أتمكن من إنشاء استجابة. حاول مرة أخرى.";
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "حدث خطأ أثناء الاتصال بالخادم.";
  }
};

// دالة تشغيل النص المحول إلى صوت
const playText = async (text, speed = "normal") => {
  try {
    let textToSpeak = text;
    if (speed === "slow") {
      textToSpeak = `Say slowly: ${text}`;
    }

    const payload = {
      contents: [{ role: "user", parts: [{ text: textToSpeak }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: VOICE_NAME },
          },
        },
      },
    };

    const response = await fetch(TTS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(
        "HTTP Error in TTS API:",
        response.status,
        response.statusText
      );
      const errorBody = await response.text();
      console.error("Error Response Body:", errorBody);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const part = result?.candidates?.[0]?.content?.parts?.[0];
    const audioData = part?.inlineData?.data;
    const mimeType = part?.inlineData?.mimeType;

    if (audioData && mimeType && mimeType.startsWith("audio/")) {
      const sampleRateMatch = mimeType.match(/rate=(\d+)/);
      const sampleRate = sampleRateMatch
        ? parseInt(sampleRateMatch[1], 10)
        : 16000;
      const pcmData = base64ToArrayBuffer(audioData);
      const wavBlob = pcmToWav(new Int16Array(pcmData), sampleRate);
      const audioUrl = URL.createObjectURL(wavBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } else {
      console.error("TTS API did not return valid audio data.", result);
    }
  } catch (error) {
    console.error("Error in playing audio:", error);
  }
};

// مكون اختبار الكتابة
const WritingTest = ({
  word,
  onAnswer,
  onSkip,
  showCorrection,
  setShowCorrection,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = () => {
    if (inputValue.trim().toLowerCase() === word.english.toLowerCase()) {
      setFeedback("صحيح!");
      setShowCorrection(false);
      setTimeout(() => onAnswer(true), 1500);
    } else {
      setFeedback("خطأ. الإجابة الصحيحة هي: " + word.english);
      setShowCorrection(true);
      setTimeout(() => onAnswer(false), 2000);
    }
  };

  useEffect(() => {
    setFeedback(null);
    setShowCorrection(false);
    setInputValue("");
  }, [word]);

  return (
    <div className="flex flex-col items-center w-full p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        اكتب الكلمة بالإنجليزية
      </h2>
      <input
        type="text"
        className="w-4/5 p-3 bg-white rounded-lg border border-gray-300 text-center text-lg mb-4 text-gray-800"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="اكتب الكلمة هنا..."
      />
      <div className="flex flex-row-reverse justify-center w-full">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg mx-2"
          onClick={handleSubmit}
        >
          ✅ تحقق
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full shadow-lg mx-2"
          onClick={onSkip}
        >
          ➡️ تخطي
        </button>
      </div>
      {feedback && (
        <div
          className={`p-4 rounded-lg mt-5 ${
            inputValue.trim().toLowerCase() === word.english.toLowerCase()
              ? "bg-green-100"
              : "bg-red-100"
          }`}
        >
          <p className="font-bold text-center text-gray-800">{feedback}</p>
          {showCorrection && (
            <p className="text-center mt-2">
              الكلمة الصحيحة:{" "}
              <span className="font-bold text-blue-600">{word.english}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// مكون اختبار الاختيار من متعدد
const MultipleChoiceTest = ({ word, onAnswer, currentTopicWords }) => {
  const [feedback, setFeedback] = useState(null);

  const getChoices = () => {
    const allWords = currentTopicWords.map((w) => w.english);
    const otherWords = allWords.filter((w) => w !== word.english);
    let choices = [word.english];
    while (choices.length < 4) {
      const randomWord =
        otherWords[Math.floor(Math.random() * otherWords.length)];
      if (randomWord && !choices.includes(randomWord)) {
        choices.push(randomWord);
      } else if (otherWords.length < 3) {
        const allWordsGlobal = Object.values(OXFORD_DATA)
          .flat()
          .map((w) => w.english);
        const randomWordGlobal =
          allWordsGlobal[Math.floor(Math.random() * allWordsGlobal.length)];
        if (randomWordGlobal && !choices.includes(randomWordGlobal)) {
          choices.push(randomWordGlobal);
        }
      }
    }
    return choices.sort(() => Math.random() - 0.5);
  };

  const choices = getChoices();

  const handleSelect = (choice) => {
    if (choice === word.english) {
      setFeedback("صحيح!");
      setTimeout(() => onAnswer(true), 1500);
    } else {
      setFeedback("خطأ. حاول مرة أخرى.");
      setTimeout(() => onAnswer(false), 1500);
    }
  };

  useEffect(() => {
    setFeedback(null);
  }, [word]);

  return (
    <div className="flex flex-col items-center w-full p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        ما هي الكلمة التي تعني:{" "}
        <span className="text-blue-600">{word.arabic}</span>؟
      </h2>
      <div className="flex flex-row-reverse flex-wrap justify-center">
        {choices.map((choice, index) => (
          <button
            key={index}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg m-2 w-2/5"
            onClick={() => handleSelect(choice)}
          >
            {choice}
          </button>
        ))}
      </div>
      {feedback && (
        <div
          className={`p-4 rounded-lg mt-5 ${
            feedback.includes("صحيح") ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <p className="font-bold text-center text-gray-800">{feedback}</p>
        </div>
      )}
    </div>
  );
};

// مكون اختبار الاستماع
const ListeningTest = ({
  word,
  onAnswer,
  onSkip,
  showCorrection,
  setShowCorrection,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = () => {
    if (inputValue.trim().toLowerCase() === word.english.toLowerCase()) {
      setFeedback("صحيح!");
      setShowCorrection(false);
      setTimeout(() => onAnswer(true), 1500);
    } else {
      setFeedback("خطأ. الإجابة الصحيحة هي: " + word.english);
      setShowCorrection(true);
      setTimeout(() => onAnswer(false), 2000);
    }
  };

  useEffect(() => {
    setFeedback(null);
    setShowCorrection(false);
    setInputValue("");
  }, [word]);

  return (
    <div className="flex flex-col items-center w-full p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        استمع واكتب الكلمة
      </h2>
      <button
        onClick={() => playText(word.english)}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg mb-4"
      >
        🎧 استمع
      </button>
      <input
        type="text"
        className="w-4/5 p-3 bg-white rounded-lg border border-gray-300 text-center text-lg mb-4 text-gray-800"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="اكتب ما سمعته..."
      />
      <div className="flex flex-row-reverse justify-center w-full">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg mx-2"
          onClick={handleSubmit}
        >
          ✅ تحقق
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full shadow-lg mx-2"
          onClick={onSkip}
        >
          ➡️ تخطي
        </button>
      </div>
      {feedback && (
        <div
          className={`p-4 rounded-lg mt-5 ${
            inputValue.trim().toLowerCase() === word.english.toLowerCase()
              ? "bg-green-100"
              : "bg-red-100"
          }`}
        >
          <p className="font-bold text-center text-gray-800">{feedback}</p>
          {showCorrection && (
            <p className="text-center mt-2">
              الكلمة الصحيحة:{" "}
              <span className="font-bold text-blue-600">{word.english}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// مكون اختبار أكمل الفراغ
const FillInTheBlankTest = ({ word, onAnswer, onSkip }) => {
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [sentenceWithBlank, setSentenceWithBlank] = useState("");

  useEffect(() => {
    // إنشاء الجملة مع فراغ
    const blankSentence = word.sentence.replace(word.english, "___");
    setSentenceWithBlank(blankSentence);
    setInputValue("");
    setFeedback(null);
  }, [word]);

  const handleSubmit = () => {
    if (inputValue.trim().toLowerCase() === word.english.toLowerCase()) {
      setFeedback("صحيح! ✅");
      setTimeout(() => onAnswer(true), 1500);
    } else {
      setFeedback(`خطأ. الكلمة الصحيحة هي: ${word.english} ❌`);
      setTimeout(() => onAnswer(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        أكمل الفراغ:
      </h2>
      <p className="text-xl italic text-gray-600 mb-4 text-center">
        {sentenceWithBlank}
      </p>
      <input
        type="text"
        className="w-4/5 p-3 bg-white rounded-lg border border-gray-300 text-center text-lg mb-4 text-gray-800"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="اكتب الكلمة الناقصة هنا..."
      />
      <div className="flex flex-row-reverse justify-center w-full">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg mx-2"
          onClick={handleSubmit}
        >
          ✅ تحقق
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full shadow-lg mx-2"
          onClick={onSkip}
        >
          ➡️ تخطي
        </button>
      </div>
      {feedback && (
        <p
          className={`mt-4 font-bold text-lg text-center ${
            feedback.includes("صحيح") ? "text-green-600" : "text-red-600"
          }`}
        >
          {feedback}
        </p>
      )}
    </div>
  );
};

// أنواع الاختبارات المتاحة
const TEST_TYPES = [
  "writing",
  "multiple_choice",
  "listening",
  "fill_in_the_blank",
];

// --- مكونات جديدة ---
// مكون إنشاء قصة قصيرة
const StoryGenerator = ({ words, level }) => {
  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateStory = async () => {
    setIsLoading(true);
    setStory("");
    const wordList = words.map((w) => w.english).join(", ");
    const prompt = `Write a very short and simple story for an ${level} English learner that includes the following words: ${wordList}. The story should be easy to understand.`;
    const generatedStory = await generateText(prompt);
    setStory(generatedStory);
    setIsLoading(false);
  };

  return (
    <div className="w-full mt-8 border-t-2 border-gray-200 pt-6 text-center">
      <button
        onClick={handleGenerateStory}
        disabled={isLoading}
        className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-full shadow-lg disabled:opacity-50"
      >
        {isLoading ? "جاري إنشاء القصة..." : "إنشاء قصة قصيرة ✨"}
      </button>
      {story && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-right">
          <h4 className="font-bold text-lg mb-2">قصتك المخصصة:</h4>
          <p className="text-gray-700 whitespace-pre-wrap">{story}</p>
        </div>
      )}
    </div>
  );
};

// مكون الترجمة الفورية
const Translator = ({ onReturn }) => {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setResult("");
    const prompt = `Translate the following Arabic sentence to English and provide a simple explanation of the English sentence structure: "${inputText}"`;
    const translationResult = await generateText(prompt);
    setResult(translationResult);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center w-full p-4">
      <div className="flex flex-row-reverse justify-between w-full items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">الترجمة الفورية</h2>
        <button
          onClick={onReturn}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg"
        >
          العودة
        </button>
      </div>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="اكتب أي جملة بالعربية هنا..."
        className="w-full h-32 p-3 bg-white rounded-lg border border-gray-300 text-lg mb-4 text-gray-800"
      />
      <button
        onClick={handleTranslate}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg disabled:opacity-50"
      >
        {isLoading ? "جاري الترجمة..." : "ترجم"}
      </button>
      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-right w-full">
          <h4 className="font-bold text-lg mb-2">النتيجة:</h4>
          <p className="text-gray-700 whitespace-pre-wrap">{result}</p>
        </div>
      )}
    </div>
  );
};

// --- مكونات جديدة لتوليد المواضيع ---
const SuggestTopic = ({ onGenerate, setInput, inputValue }) => {
  return (
    <div className="flex flex-col items-center w-full p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        اقترح موضوعًا جديدًا
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        اكتب اسم موضوع تود تعلمه (مثل: الفضاء، الطبخ، الرياضة) وسنقوم بإنشاء درس
        كامل لك.
      </p>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInput(e.target.value)}
        placeholder="مثلاً: السفر إلى الفضاء"
        className="w-full p-3 bg-white rounded-lg border border-gray-300 text-center text-lg mb-4"
      />
      <button
        onClick={onGenerate}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg"
      >
        🚀 توليد الدرس
      </button>
    </div>
  );
};

const GeneratedTopic = ({ content, isLoading, onReturn }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const handleAnswer = (answer) => {
    if (answer === content.questions[currentQuestionIndex].correctAnswer) {
      setFeedback("إجابة صحيحة! ✅");
    } else {
      setFeedback("إجابة خاطئة. ❌");
    }
    setTimeout(() => {
      setFeedback(null);
      if (currentQuestionIndex < content.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        alert("لقد أكملت الأسئلة!");
      }
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-blue-600 animate-pulse">
          جاري توليد الدرس الخاص بك...
        </h2>
        <p className="text-gray-600 mt-2">قد يستغرق هذا بضع لحظات.</p>
      </div>
    );
  }

  if (!content || !content.words) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold text-red-600">حدث خطأ</h2>
        <p className="text-gray-600 mt-2">
          لم نتمكن من توليد المحتوى. يرجى المحاولة مرة أخرى.
        </p>
        <button
          onClick={onReturn}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-full"
        >
          العودة
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        درس عن: {content.topic}
      </h2>

      {/* قسم المفردات */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-purple-600 mb-4">
          المفردات الجديدة 📚
        </h3>
        <div className="space-y-4">
          {content.words.map((word, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="flex flex-row-reverse justify-between items-center">
                <p className="text-xl font-bold">
                  {word.english} -{" "}
                  <span className="font-normal text-gray-600">
                    {word.arabic}
                  </span>
                </p>
                <button
                  onClick={() => playText(word.english)}
                  className="bg-gray-200 p-2 rounded-full"
                >
                  🔊
                </button>
              </div>
              <p className="text-md italic text-gray-500 mt-1 text-right">
                {word.sentence}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* قسم القصة */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-green-600 mb-4">القصة 📖</h3>
        <div className="bg-green-50 p-4 rounded-lg shadow-sm">
          <p className="text-lg leading-relaxed text-right">{content.story}</p>
        </div>
      </div>

      {/* قسم الاختبارات */}
      <div>
        <h3 className="text-2xl font-bold text-orange-600 mb-4">
          اختبر نفسك ✏️
        </h3>
        <div className="bg-orange-50 p-4 rounded-lg shadow-sm">
          {content.questions && content.questions.length > 0 ? (
            <div>
              <p className="text-lg font-semibold mb-3 text-right">
                {content.questions[currentQuestionIndex].questionEnglish}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {content.questions[currentQuestionIndex].options.map(
                  (option, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(option)}
                      className="bg-white hover:bg-blue-100 text-blue-600 font-bold py-3 px-4 rounded-lg border border-blue-600"
                    >
                      {option}
                    </button>
                  )
                )}
              </div>
              {feedback && (
                <p className="text-center mt-4 font-bold text-lg">{feedback}</p>
              )}
            </div>
          ) : (
            <p>لا توجد أسئلة لهذا الموضوع.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// مكون عرض محتوى الدرس مع ميزة النطق الجديدة
const LessonContent = ({
  word,
  topicWords,
  level,
  showTranslation,
  onToggleTranslation,
  onReturnToTopics,
  onKnowWord,
  onDontKnowWord,
  dailyProgress,
  dailyGoal,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [pronunciationScore, setPronunciationScore] = useState(null);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    if (word.english) {
      playText(word.english);
    }
    setPronunciationScore(null); // Reset score for new word
  }, [word.english]);

  const handleRecording = () => {
    if (isRecording) {
      // Stop recording
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        // Simulate pronunciation check
        const score = Math.floor(Math.random() * 31) + 70; // Random score between 70 and 100
        setPronunciationScore(score);
      }
    } else {
      // Start recording
      setPronunciationScore(null);
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.start();
          setIsRecording(true);
          // Stop recording after 3 seconds
          setTimeout(() => {
            if (
              mediaRecorderRef.current &&
              mediaRecorderRef.current.state === "recording"
            ) {
              mediaRecorderRef.current.stop();
              setIsRecording(false);
              const score = Math.floor(Math.random() * 31) + 70;
              setPronunciationScore(score);
            }
          }, 3000);
        })
        .catch((err) => {
          console.error("Error starting recording:", err);
          alert("لا يمكن الوصول إلى الميكروفون. يرجى السماح بالوصول.");
        });
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-4">
      <div className="flex flex-row-reverse justify-between w-full items-center mb-4">
        <div className="flex items-center space-x-4 space-x-reverse">
          <h1 className="text-7xl font-extrabold text-gray-800">
            {word.english}
          </h1>
          <button
            onClick={() => playText(word.english)}
            className="bg-gray-200 hover:bg-gray-300 p-3 rounded-full"
          >
            🔊
          </button>
        </div>
      </div>
      <div className="w-full flex justify-center mb-4">
        <p className="text-sm font-bold text-gray-600">
          التقدم اليومي: {dailyProgress} / {dailyGoal}
        </p>
      </div>
      <div className="relative text-center mt-4 mb-4">
        <div className="flex flex-row-reverse items-center justify-center space-x-2 space-x-reverse">
          <p className="text-xl italic text-gray-600">{word.sentence}</p>
          <button
            onClick={() => playText(word.sentence)}
            className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
          >
            🔊
          </button>
        </div>
        {showTranslation && (
          <p className="text-lg text-gray-400 mt-1">{word.sentenceArabic}</p>
        )}
        <button
          onClick={onToggleTranslation}
          className="absolute left-0 top-0 -translate-x-full bg-yellow-400 hover:bg-yellow-500 p-2 rounded-full shadow-md"
        >
          📖
        </button>
      </div>
      {showTranslation && (
        <p className="text-3xl font-bold text-gray-500 text-center">
          {word.arabic}
        </p>
      )}

      {/* ميزة تسجيل النطق الجديدة */}
      <div className="flex flex-col items-center mt-8 space-y-4">
        <button
          onClick={handleRecording}
          className={`${
            isRecording ? "bg-gray-500" : "bg-red-500 hover:bg-red-600"
          } text-white font-bold py-3 px-6 rounded-full shadow-lg`}
        >
          {isRecording ? "⏹️ جاري التسجيل..." : "🎤 سجل وقارن نطقك"}
        </button>
        {pronunciationScore !== null && (
          <div className="text-center">
            <p className="text-lg font-bold">نتيجة النطق:</p>
            <p
              className={`text-3xl font-bold ${
                pronunciationScore > 85 ? "text-green-600" : "text-orange-500"
              }`}
            >
              {pronunciationScore}%
            </p>
          </div>
        )}
      </div>

      {/* الأزرار الجديدة: أعرفها / لا أعرفها */}
      <div className="flex flex-row-reverse justify-center w-full mt-8">
        <button
          onClick={onKnowWord}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full shadow-lg mx-2"
        >
          أعرفها ✅
        </button>
        <button
          onClick={onDontKnowWord}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full shadow-lg mx-2"
        >
          لا أعرفها ✍️
        </button>
      </div>

      {/* إضافة مكون إنشاء القصة */}
      <StoryGenerator words={topicWords} level={level} />
    </div>
  );
};

// مكون لوحة التحكم والتقدم
const ProgressDashboard = ({
  dailyGoal,
  setDailyGoal,
  dailyProgress,
  setGoalInput,
  goalInput,
  progressHistory,
}) => {
  const {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } = Recharts;
  const formattedData = progressHistory.map((item) => ({
    name: new Date(item.date).toLocaleDateString("ar-EG", {
      day: "numeric",
      month: "short",
    }),
    التقدم: item.progress,
    الهدف: dailyGoal,
  }));

  return (
    <div className="flex flex-col items-center w-full mt-10 p-4">
      <h2 className="text-3xl font-bold text-purple-600 mb-2">لوحة التقدم</h2>
      <p className="text-lg text-gray-700 text-center mb-4">
        هذه هي لوحة التحكم الخاصة بك. يمكنك هنا تتبع تقدمك في التعلم.
      </p>

      {/* عرض الأهداف والتقدم اليومي */}
      <div className="w-full bg-blue-100 rounded-xl p-6 shadow-md mb-6">
        <h3 className="text-2xl font-bold text-blue-800 mb-2">الهدف اليومي</h3>
        <p className="text-xl text-blue-700 mb-4">
          الهدف الحالي: <span className="font-extrabold">{dailyGoal}</span> كلمة
        </p>
        <div className="flex items-center justify-between mb-4">
          <p className="text-lg font-semibold text-blue-700">التقدم اليومي:</p>
          <p className="text-lg font-bold text-blue-900">
            {dailyProgress} / {dailyGoal}
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, (dailyProgress / dailyGoal) * 100)}%`,
            }}
          ></div>
        </div>
      </div>

      {/* رسم بياني للتقدم */}
      <div className="w-full bg-gray-100 rounded-xl p-6 shadow-md mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          التقدم اليومي (آخر 7 أيام)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="التقدم" fill="#8884d8" />
            <Bar dataKey="الهدف" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* تحديد الهدف اليومي */}
      <div className="w-full bg-gray-100 rounded-xl p-6 shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          تحديد الهدف اليومي
        </h3>
        <p className="text-md text-gray-600 mb-4">
          اختر عدد الكلمات التي تريد تعلمها كل يوم.
        </p>
        <div className="flex flex-row-reverse justify-between items-center">
          <input
            type="number"
            min="1"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            className="w-1/3 p-3 text-center rounded-lg border-2 border-gray-300 text-lg"
          />
          <button
            onClick={() => setDailyGoal(parseInt(goalInput, 10))}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg"
          >
            حفظ الهدف
          </button>
        </div>
      </div>
    </div>
  );
};

// مكون قائمة القصص
const StorySelection = ({ onStorySelect, onReturn }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row-reverse justify-between w-full items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          اختر قصة للقراءة:
        </h2>
        <button
          onClick={onReturn}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300"
        >
          العودة
        </button>
      </div>
      {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
        <div key={level} className="w-full mb-6">
          <h3 className="text-xl font-bold text-blue-600 mb-3">
            المستوى {level}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {STORIES.filter((s) => s.level === level).map((story, index) => (
              <button
                key={index}
                onClick={() => onStorySelect(story)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 px-6 rounded-lg text-lg text-right shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                {story.title}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// مكون قارئ القصص
const StoryReader = ({ story, onReturn }) => {
  return (
    <div className="flex flex-col items-center w-full p-4">
      <div className="flex flex-row-reverse justify-between w-full items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{story.title}</h2>
        <button
          onClick={onReturn}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300"
        >
          العودة للقصص
        </button>
      </div>
      <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap text-right">
        {story.content}
      </p>
    </div>
  );
};

// مكون مراجعة الكلمات الجديدة
const ReviewWords = ({ knownWords, onReturn }) => {
  return (
    <div className="flex flex-col items-center w-full p-4">
      <div className="flex flex-row-reverse justify-between w-full items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          الكلمات التي تعلمتها
        </h2>
        <button
          onClick={onReturn}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300"
        >
          العودة
        </button>
      </div>
      {knownWords.length === 0 ? (
        <p className="text-lg text-gray-600 mt-8">
          لم تتعلم أي كلمات بعد. ابدأ درسًا لتعلم كلمات جديدة!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
          {knownWords.map((word, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-row-reverse justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {word.english}
                </h3>
                <p className="text-md text-gray-600">{word.arabic}</p>
              </div>
              <button
                onClick={() => playText(word.english)}
                className="bg-gray-300 hover:bg-gray-400 p-2 rounded-full"
              >
                🔊
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// مكونات قسم القواعد النحوية
const GrammarLevels = ({ onLevelSelect, onReturn }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row-reverse justify-between w-full items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          اختر مستوى القواعد:
        </h2>
        <button
          onClick={onReturn}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300"
        >
          العودة
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full">
        {GRAMMAR_DATA.map((levelData, index) => (
          <button
            key={index}
            onClick={() => onLevelSelect(index)}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 px-4 rounded-lg text-xl shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            المستوى {levelData.level}
          </button>
        ))}
      </div>
    </div>
  );
};

const GrammarRules = ({ currentLevel, onRuleSelect, onReturn }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row-reverse justify-between w-full items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          اختر قاعدة من المستوى {currentLevel.level}:
        </h2>
        <button
          onClick={onReturn}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300"
        >
          العودة للمستويات
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 w-full">
        {currentLevel.rules.map((rule, index) => (
          <button
            key={index}
            onClick={() => onRuleSelect(index)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 px-6 rounded-lg text-lg text-right shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            {rule.title}
          </button>
        ))}
      </div>
    </div>
  );
};

const GrammarLesson = ({ rule, onReturn }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const handleAnswer = (userAnswer) => {
    if (rule.questions.length === 0) return;
    if (userAnswer === rule.questions[questionIndex].correctAnswer) {
      setFeedback("إجابة صحيحة! ✅");
    } else {
      setFeedback("إجابة خاطئة. حاول مرة أخرى. ❌");
    }
    setTimeout(() => {
      setFeedback(null);
      if (questionIndex < rule.questions.length - 1) {
        setQuestionIndex((prev) => prev + 1);
      } else {
        alert("لقد أكملت جميع الأسئلة!");
        onReturn();
      }
    }, 2000);
  };

  useEffect(() => {
    setQuestionIndex(0);
    setFeedback(null);
  }, [rule]);

  return (
    <div className="flex flex-col w-full p-4">
      <div className="flex flex-row-reverse justify-between w-full items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{rule.title}</h2>
        <button
          onClick={onReturn}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300"
        >
          العودة للقواعد
        </button>
      </div>
      <div className="bg-gray-50 rounded-xl p-6 shadow-md mb-6 text-right">
        <h3 className="text-xl font-bold text-gray-800 mb-2">الشرح:</h3>
        <p className="text-lg text-gray-700 leading-relaxed">
          {rule.explanation}
        </p>
      </div>
      <div className="bg-gray-50 rounded-xl p-6 shadow-md mb-6 text-right">
        <h3 className="text-xl font-bold text-gray-800 mb-2">أمثلة:</h3>
        {rule.examples.map((example, index) => (
          <p key={index} className="text-lg text-gray-700 leading-relaxed mb-2">
            - {example.english}{" "}
            <span className="text-gray-500">({example.arabic})</span>
          </p>
        ))}
      </div>
      <div className="bg-gray-100 rounded-xl p-6 shadow-md text-right">
        <h3 className="text-xl font-bold text-gray-800 mb-4">تدريب عملي:</h3>
        {rule.questions.length > 0 ? (
          <div className="mb-4">
            <p className="text-lg text-gray-800 font-semibold mb-2">
              {rule.questions[questionIndex].questionEnglish}{" "}
              <span className="text-gray-500">
                ({rule.questions[questionIndex].questionArabic})
              </span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
              {rule.questions[questionIndex].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="bg-white hover:bg-blue-100 text-blue-600 font-bold py-3 px-4 rounded-lg border border-blue-600 transition-all duration-300"
                >
                  {option}
                </button>
              ))}
            </div>
            {feedback && (
              <p className="text-center mt-4 font-bold text-lg">{feedback}</p>
            )}
          </div>
        ) : (
          <p className="text-gray-600">لا توجد أسئلة لهذه القاعدة بعد.</p>
        )}
      </div>
    </div>
  );
};

// Components for Podcasts
const PodcastLevels = ({ onLevelSelect, onReturn }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row-reverse justify-between w-full items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          اختر مستوى البودكاست:
        </h2>
        <button
          onClick={onReturn}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300"
        >
          العودة
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full">
        {PODCASTS_DATA.map((levelData, index) => (
          <button
            key={index}
            onClick={() => onLevelSelect(index)}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-6 px-4 rounded-lg text-xl shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            المستوى {levelData.level}
          </button>
        ))}
      </div>
    </div>
  );
};

const PodcastEpisodes = ({ currentLevel, onEpisodeSelect, onReturn }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row-reverse justify-between w-full items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          حلقات المستوى {currentLevel.level}:
        </h2>
        <button
          onClick={onReturn}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300"
        >
          العودة للمستويات
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 w-full">
        {currentLevel.episodes.map((episode, index) => (
          <button
            key={index}
            onClick={() => onEpisodeSelect(episode)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 px-6 rounded-lg text-lg text-right shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {episode.title}
            </h3>
            <p className="text-sm text-gray-600 font-normal">
              {episode.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

const PodcastPlayer = ({ podcast, onReturn }) => {
  return (
    <div className="flex flex-col items-center w-full p-4">
      <div className="flex flex-row-reverse justify-between w-full items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{podcast.title}</h2>
        <button
          onClick={onReturn}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300"
        >
          العودة للحلقات
        </button>
      </div>
      <p className="text-lg text-gray-700 leading-relaxed text-right mb-6">
        {podcast.description}
      </p>
      <audio controls src={podcast.audioUrl} className="w-full"></audio>
    </div>
  );
};

// --- مكونات المراجعة الجديدة ---

// مكون اختيار نوع المراجعة
const ReviewSelection = ({ onSelect, onReturn }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row-reverse justify-between w-full items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          اختر طريقة المراجعة
        </h2>
        <button
          onClick={onReturn}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg"
        >
          العودة
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-4">
        <button
          onClick={() => onSelect("quick")}
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-10 px-4 rounded-lg text-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          🚀 مراجعة سريعة
        </button>
        <button
          onClick={() => onSelect("slow")}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-10 px-4 rounded-lg text-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          🐢 مراجعة بطيئة
        </button>
      </div>
    </div>
  );
};

// مكون المراجعة السريعة
const QuickReview = ({ reviewWords, onEndReview }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionType, setQuestionType] = useState("");
  const [choices, setChoices] = useState([]);
  const [timer, setTimer] = useState(15);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentWord = reviewWords[currentIndex];

  // Timer effect
  useEffect(() => {
    if (!isAnswered && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !isAnswered) {
      handleAnswer(null); // Timeout
    }
  }, [timer, isAnswered]);

  // New question setup effect
  useEffect(() => {
    if (currentIndex < reviewWords.length) {
      const type = ["listen", "ar-en", "en-ar"][currentIndex % 3];
      setQuestionType(type);
      generateChoices(type, reviewWords[currentIndex]);
      setTimer(15);
      setFeedback(null);
      setIsAnswered(false);
      if (type === "listen") {
        playText(reviewWords[currentIndex].english);
      }
    }
  }, [currentIndex, reviewWords]);

  const generateChoices = (type, word) => {
    let correctValue, incorrectValues;
    if (type === "listen" || type === "ar-en") {
      correctValue = word.english;
      incorrectValues = Object.values(OXFORD_DATA)
        .flat()
        .map((w) => w.english)
        .filter((w) => w !== correctValue);
    } else {
      // en-ar
      correctValue = word.arabic;
      incorrectValues = Object.values(OXFORD_DATA)
        .flat()
        .map((w) => w.arabic)
        .filter((w) => w !== correctValue);
    }

    let options = [correctValue];
    while (options.length < 4) {
      const randomWord =
        incorrectValues[Math.floor(Math.random() * incorrectValues.length)];
      if (!options.includes(randomWord)) {
        options.push(randomWord);
      }
    }
    setChoices(options.sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (selectedAnswer) => {
    setIsAnswered(true);
    let isCorrect = false;
    if (questionType === "listen" || questionType === "ar-en") {
      isCorrect = selectedAnswer === currentWord.english;
    } else {
      // en-ar
      isCorrect = selectedAnswer === currentWord.arabic;
    }

    if (isCorrect) {
      setFeedback("صحيح! ✅");
      setScore((s) => s + 1);
    } else {
      setFeedback(
        `خطأ! الإجابة الصحيحة: ${
          questionType === "en-ar" ? currentWord.arabic : currentWord.english
        }`
      );
    }

    setTimeout(() => {
      if (currentIndex < reviewWords.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        // End of review
      }
    }, 2000);
  };

  if (currentIndex >= reviewWords.length) {
    return (
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-600 mb-4">
          انتهت المراجعة!
        </h2>
        <p className="text-xl text-gray-700">
          نتيجتك: {score} / {reviewWords.length}
        </p>
        <button
          onClick={onEndReview}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full"
        >
          العودة
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full p-4">
      <div className="w-full flex justify-between items-center mb-4">
        <p className="text-lg font-bold">النتيجة: {score}</p>
        <p className="text-2xl font-bold text-red-500">{timer}</p>
        <p className="text-lg font-bold">
          السؤال: {currentIndex + 1} / {reviewWords.length}
        </p>
      </div>

      {questionType === "listen" && (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            استمع واختر الكلمة الصحيحة:
          </h2>
          <button
            onClick={() => playText(currentWord.english)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg mb-4"
          >
            🎧 استمع مرة أخرى
          </button>
        </>
      )}
      {questionType === "ar-en" && (
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          ما معنى: <span className="text-blue-600">{currentWord.arabic}</span>؟
        </h2>
      )}
      {questionType === "en-ar" && (
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          ما معنى: <span className="text-blue-600">{currentWord.english}</span>؟
        </h2>
      )}

      <div className="grid grid-cols-2 gap-4 w-full mt-4">
        {choices.map((choice, index) => (
          <button
            key={index}
            disabled={isAnswered}
            onClick={() => handleAnswer(choice)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 px-6 rounded-lg text-lg shadow-md disabled:opacity-50"
          >
            {choice}
          </button>
        ))}
      </div>
      {feedback && (
        <p className="mt-6 font-bold text-xl text-center">{feedback}</p>
      )}
    </div>
  );
};

// مكون المراجعة البطيئة
const SlowReview = ({ reviewWords, onEndReview }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionType, setQuestionType] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentWord = reviewWords[currentIndex];

  useEffect(() => {
    if (currentIndex < reviewWords.length) {
      const type = ["listen-write", "ar-en-write", "en-ar-write"][
        currentIndex % 3
      ];
      setQuestionType(type);
      setInputValue("");
      setFeedback(null);
      setIsAnswered(false);
      if (type === "listen-write") {
        playText(currentWord.english);
      }
    }
  }, [currentIndex, reviewWords]);

  const handleSubmit = () => {
    setIsAnswered(true);
    let isCorrect = false;
    const correctAnswer =
      questionType === "en-ar-write" ? currentWord.arabic : currentWord.english;

    if (inputValue.trim().toLowerCase() === correctAnswer.toLowerCase()) {
      isCorrect = true;
      setScore((s) => s + 1);
      setFeedback("صحيح! ✅");
    } else {
      setFeedback(`خطأ! الإجابة الصحيحة: ${correctAnswer}`);
    }

    setTimeout(() => {
      if (currentIndex < reviewWords.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        // End of review
      }
    }, 2000);
  };

  if (currentIndex >= reviewWords.length) {
    return (
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-600 mb-4">
          انتهت المراجعة!
        </h2>
        <p className="text-xl text-gray-700">
          نتيجتك: {score} / {reviewWords.length}
        </p>
        <button
          onClick={onEndReview}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full"
        >
          العودة
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full p-4">
      <p className="text-lg font-bold mb-4">
        السؤال: {currentIndex + 1} / {reviewWords.length}
      </p>

      {questionType === "listen-write" && (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            استمع واكتب الكلمة:
          </h2>
          <button
            onClick={() => playText(currentWord.english)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg mb-4"
          >
            🎧 استمع
          </button>
        </>
      )}
      {questionType === "ar-en-write" && (
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          اكتب معنى: <span className="text-blue-600">{currentWord.arabic}</span>{" "}
          بالإنجليزية
        </h2>
      )}
      {questionType === "en-ar-write" && (
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          اكتب معنى:{" "}
          <span className="text-blue-600">{currentWord.english}</span> بالعربية
        </h2>
      )}

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={isAnswered}
        className="w-4/5 p-3 bg-white rounded-lg border border-gray-300 text-center text-lg my-4"
      />
      <button
        onClick={handleSubmit}
        disabled={isAnswered}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg disabled:opacity-50"
      >
        تحقق
      </button>
      {feedback && (
        <p className="mt-6 font-bold text-xl text-center">{feedback}</p>
      )}
    </div>
  );
};

// --- مكونات المنهج الدراسي الجديدة ---
const CurriculumHome = ({ onUnitSelect, onReturn }) => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-row-reverse justify-between w-full items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          المنهج الدراسي
        </h2>
        <button
          onClick={onReturn}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg"
        >
          العودة
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {CURRICULUM_DATA.map((unit, index) => (
          <button
            key={unit.id}
            onClick={() => onUnitSelect(index)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 px-6 rounded-lg text-lg text-right shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <span className="bg-blue-500 text-white text-sm font-bold mr-2 px-2.5 py-0.5 rounded-full">
              {unit.level}
            </span>
            {unit.id}. {unit.title}
          </button>
        ))}
      </div>
    </div>
  );
};

const CurriculumUnit = ({ unit, onReturn, onUnitCompleted }) => {
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});

  const handleAnswer = (exerciseIndex, selectedOption) => {
    const exercise = unit.content.filter((item) => item.type === "exercise")[
      exerciseIndex
    ];
    const isCorrect = selectedOption === exercise.correctAnswer;
    setAnswers({ ...answers, [exercise.title]: selectedOption });
    setFeedback({
      ...feedback,
      [exercise.title]: isCorrect ? "صحيح!" : "خطأ.",
    });
  };

  let exerciseCounter = -1;

  return (
    <div className="flex flex-col w-full p-4">
      <div className="flex flex-row-reverse justify-between w-full items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{unit.title}</h2>
        <button
          onClick={onReturn}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg"
        >
          العودة للمنهج
        </button>
      </div>
      {unit.content.map((item, index) => {
        if (item.type === "exercise") {
          exerciseCounter++;
          const currentExerciseIndex = exerciseCounter;
          return (
            <div
              key={index}
              className="mb-8 bg-gray-50 p-4 rounded-lg shadow-sm text-right"
            >
              <h3 className="text-xl font-bold text-purple-600 mb-3 text-right">
                {item.title}
              </h3>
              <p className="font-semibold mb-3">{item.question}</p>
              <div className="flex flex-col items-end space-y-2">
                {item.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(currentExerciseIndex, option)}
                    className={`w-full text-right p-2 rounded-lg border-2 ${
                      answers[item.title] === option
                        ? feedback[item.title] === "صحيح!"
                          ? "border-green-500 bg-green-100"
                          : "border-red-500 bg-red-100"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {feedback[item.title] && (
                <p
                  className={`mt-2 font-bold ${
                    feedback[item.title] === "صحيح!"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {feedback[item.title]}
                </p>
              )}
            </div>
          );
        }
        return (
          <div key={index} className="mb-8 bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-purple-600 mb-3 text-right">
              {item.title}
            </h3>
            {item.type === "dialogue" && (
              <div className="space-y-2 text-right">
                {item.lines.map((line, i) => (
                  <p key={i}>
                    <span className="font-bold">{line.speaker}:</span>{" "}
                    {line.text}
                  </p>
                ))}
              </div>
            )}
            {item.type === "vocabulary" && (
              <ul className="list-disc list-inside text-right">
                {item.words.map((word, i) => (
                  <li key={i}>
                    {word.english} - {word.arabic}
                  </li>
                ))}
              </ul>
            )}
            {item.type === "grammar" && (
              <div>
                <p className="mb-2 text-right">{item.explanation}</p>
                <ul className="list-disc list-inside text-right text-gray-600 italic">
                  {item.examples.map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
      <button
        onClick={() => onUnitCompleted(unit.id)}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full self-center mt-4"
      >
        ✅ إكمال الوحدة
      </button>
    </div>
  );
};

// --- مكونات الميزات الجديدة ---
const Achievements = ({ knownWordsCount, completedUnitsCount, onReturn }) => {
  return (
    <div className="flex flex-col items-center w-full p-4">
      <div className="flex flex-row-reverse justify-between w-full items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">الإنجازات</h2>
        <button
          onClick={onReturn}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg"
        >
          العودة
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {ACHIEVEMENTS_DATA.map((ach) => {
          const isUnlocked = ach.id.includes("lesson")
            ? completedUnitsCount >= ach.goal
            : knownWordsCount >= ach.goal;
          const progress = ach.id.includes("lesson")
            ? completedUnitsCount
            : knownWordsCount;
          return (
            <div
              key={ach.id}
              className={`p-4 rounded-lg shadow-md flex items-center ${
                isUnlocked ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              <i
                className={`fas ${ach.icon} text-3xl mx-4 ${
                  isUnlocked ? "text-yellow-500" : "text-gray-400"
                }`}
              ></i>
              <div>
                <h3
                  className={`font-bold ${
                    isUnlocked ? "text-green-800" : "text-gray-800"
                  }`}
                >
                  {ach.title}
                </h3>
                <p className="text-sm text-gray-600">{ach.description}</p>
                {!isUnlocked && (
                  <p className="text-xs text-gray-500">
                    التقدم: {progress}/{ach.goal}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StudyWithFriend = ({ onReturn }) => {
  const [feedback, setFeedback] = useState(null);
  const word = { english: "information", arabic: "معلومات" };
  const options = ["بيانات", "معلومة", "معلومات", "معرفة"].sort(
    () => Math.random() - 0.5
  );

  const handleAnswer = (option) => {
    if (option === word.arabic) {
      setFeedback({ correct: true, option });
    } else {
      setFeedback({ correct: false, option });
    }
    setTimeout(() => setFeedback(null), 2000);
  };

  return (
    <div className="flex flex-col items-center w-full p-4">
      <div className="flex flex-row-reverse justify-between w-full items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">المذاكرة مع صديق</h2>
        <button
          onClick={onReturn}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg"
        >
          العودة
        </button>
      </div>
      <div className="bg-blue-50 p-6 rounded-lg text-center w-full shadow-inner">
        <p className="text-blue-800 font-bold mb-3">
          ما هو معنى الكلمة التالية؟
        </p>
        <div className="text-4xl font-bold text-blue-900 mb-6">
          {word.english}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className={`p-3 rounded-lg border-2 transition-all duration-300
                                ${
                                  feedback && feedback.option === option
                                    ? feedback.correct
                                      ? "bg-green-500 text-white border-green-500"
                                      : "bg-red-500 text-white border-red-500"
                                    : "bg-white hover:bg-blue-100 text-blue-700 border-blue-300"
                                }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Reminders = ({ onReturn }) => {
  return (
    <div className="flex flex-col items-center w-full p-4">
      <div className="flex flex-row-reverse justify-between w-full items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">التذكيرات</h2>
        <button
          onClick={onReturn}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg"
        >
          العودة
        </button>
      </div>
      <div className="bg-yellow-50 p-8 rounded-lg text-center w-full shadow-inner">
        <p className="text-yellow-800 text-lg">ميزة التذكيرات قادمة قريباً!</p>
      </div>
    </div>
  );
};

// --- المكونات الجديدة المدعومة بـ Gemini API ---
const ConversationPractice = ({ onReturn }) => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your AI English tutor. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const chatHistory = newMessages.map((msg) => ({
      role: msg.sender === "ai" ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    const prompt = `You are a friendly and patient English tutor. Continue this conversation with the user. Keep your responses simple and encouraging, suitable for an A2 level learner. The conversation history is as follows: ${JSON.stringify(
      chatHistory
    )}`;

    const aiResponseText = await generateText(prompt);
    const aiMessage = { sender: "ai", text: aiResponseText };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
    setIsLoading(false);
    playText(aiResponseText);
  };

  return (
    <div className="flex flex-col w-full h-[600px] p-4">
      <div className="flex flex-row-reverse justify-between w-full items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">تدريب على المحادثة</h2>
        <button
          onClick={onReturn}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg"
        >
          العودة
        </button>
      </div>
      <div className="flex-grow bg-gray-50 rounded-lg p-4 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            } mb-3`}
          >
            <div
              className={`p-3 rounded-lg max-w-xs ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === "ai" && (
              <button
                onClick={() => playText(msg.text)}
                className="self-center ml-2 bg-gray-300 p-2 rounded-full"
              >
                🔊
              </button>
            )}
          </div>
        ))}
        {isLoading && <div className="text-center text-gray-500">...يفكر</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="اكتب رسالتك هنا..."
          className="flex-grow p-3 rounded-l-lg border-2 border-gray-300"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-blue-600 text-white p-3 rounded-r-lg"
        >
          إرسال
        </button>
      </div>
    </div>
  );
};

const GrammarExplainer = ({ onReturn }) => {
  const [inputText, setInputText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleExplain = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setExplanation("");
    const prompt = `You are an expert English grammar teacher explaining concepts to an Arabic-speaking beginner. Analyze the following English sentence: "${inputText}". Explain its grammatical structure in simple Arabic. Identify the subject, verb, object, tense, and any other key components.`;
    const result = await generateText(prompt);
    setExplanation(result);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center w-full p-4">
      <div className="flex flex-row-reverse justify-between w-full items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">شرح القواعد ✨</h2>
        <button
          onClick={onReturn}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg"
        >
          العودة
        </button>
      </div>
      <p className="text-gray-600 mb-4 text-center">
        أدخل أي جملة باللغة الإنجليزية، وسيقوم الذكاء الاصطناعي بشرح قواعدها لك
        بالتفصيل.
      </p>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="e.g., The cat is sleeping on the mat."
        className="w-full h-24 p-3 bg-white rounded-lg border border-gray-300 text-lg mb-4 text-left"
        dir="ltr"
      />
      <button
        onClick={handleExplain}
        disabled={isLoading}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg disabled:opacity-50"
      >
        {isLoading ? "...جاري التحليل" : "اشرح لي"}
      </button>
      {explanation && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-right w-full">
          <h4 className="font-bold text-lg mb-2">الشرح:</h4>
          <p className="text-gray-700 whitespace-pre-wrap">{explanation}</p>
        </div>
      )}
    </div>
  );
};

// المكون الرئيسي للتطبيق
const App = () => {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [appId, setAppId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const [currentLevelIndex, setCurrentLevelIndex] = useState(null);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [unlearnedWords, setUnlearnedWords] = useState([]);
  const [showCorrection, setShowCorrection] = useState(false);

  // حالات جديدة للقراءة والقصص والمراجعة
  const [viewMode, setViewMode] = useState("home");
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [knownWords, setKnownWords] = useState([]);
  const [reviewWords, setReviewWords] = useState([]);

  // حالات جديدة للأهداف اليومية
  const [dailyGoal, setDailyGoal] = useState(5);
  const [dailyProgress, setDailyProgress] = useState(0);
  const [goalInput, setGoalInput] = useState(5);
  const [progressHistory, setProgressHistory] = useState([]);

  // حالات جديدة للقواعد النحوية
  const [currentGrammarLevelIndex, setCurrentGrammarLevelIndex] =
    useState(null);
  const [currentRuleIndex, setCurrentRuleIndex] = useState(null);

  // حالات جديدة للبودكاست
  const [currentPodcastLevelIndex, setCurrentPodcastLevelIndex] =
    useState(null);
  const [selectedPodcast, setSelectedPodcast] = useState(null);

  // حالات جديدة لتوليد المواضيع
  const [suggestedTopicInput, setSuggestedTopicInput] = useState("");
  const [generatedTopicContent, setGeneratedTopicContent] = useState(null);
  const [isLoadingGeneratedContent, setIsLoadingGeneratedContent] =
    useState(false);

  // حالات جديدة للمنهج الدراسي
  const [currentUnitIndex, setCurrentUnitIndex] = useState(null);
  const [completedUnits, setCompletedUnits] = useState([]);

  const currentLevel =
    currentLevelIndex !== null
      ? OXFORD_DATA[Object.keys(OXFORD_DATA)[currentLevelIndex]]
      : null;
  const currentTopic = null; // No more topics, just levels
  const currentWord = currentLevel ? currentLevel[currentWordIndex] : null;
  const currentTest = TEST_TYPES[currentTestIndex];

  const currentGrammarLevel =
    currentGrammarLevelIndex !== null
      ? GRAMMAR_DATA[currentGrammarLevelIndex]
      : null;
  const currentRule =
    currentGrammarLevel && currentRuleIndex !== null
      ? currentGrammarLevel.rules[currentRuleIndex]
      : null;

  const currentPodcastLevel =
    currentPodcastLevelIndex !== null
      ? PODCASTS_DATA[currentPodcastLevelIndex]
      : null;
  const currentUnit =
    currentUnitIndex !== null ? CURRICULUM_DATA[currentUnitIndex] : null;

  // دالة لحفظ بيانات المستخدم في Firestore
  const saveUserData = async (data) => {
    if (db && userId && appId) {
      const userDocRef = doc(
        db,
        `artifacts/${appId}/users/${userId}/data`,
        "userProgress"
      );
      try {
        await setDoc(userDocRef, data, { merge: true });
        console.log("User data saved successfully!");
      } catch (e) {
        console.error("Error saving user data: ", e);
      }
    }
  };

  const handleReturnToHome = () => {
    setCurrentLevelIndex(null);
    setCurrentTopicIndex(null);
    setCurrentWordIndex(0);
    setTestMode(false);
    setCurrentGrammarLevelIndex(null);
    setCurrentRuleIndex(null);
    setCurrentPodcastLevelIndex(null);
    setSelectedPodcast(null);
    setGeneratedTopicContent(null);
    setSuggestedTopicInput("");
    setCurrentUnitIndex(null);
    setViewMode("home");
  };

  const handleLevelSelect = (levelIndex) => {
    setCurrentLevelIndex(levelIndex);
    setCurrentTopicIndex(null);
    setViewMode("topicSelection");
  };

  const handleTopicSelect = (topicIndex) => {
    setCurrentTopicIndex(topicIndex);
    setCurrentWordIndex(0);
    setTestMode(false);
    setViewMode("lesson");
  };

  const handleReturnToLevels = () => {
    setCurrentLevelIndex(null);
    setCurrentTopicIndex(null);
    setCurrentWordIndex(0);
    setTestMode(false);
    setViewMode("levelSelection");
  };

  const handleReturnToTopics = () => {
    setCurrentTopicIndex(null);
    setCurrentWordIndex(0);
    setTestMode(false);
    setViewMode("topicSelection");
  };

  const handleWordKnown = async () => {
    // إضافة الكلمة إلى قائمة الكلمات المعروفة
    const newKnownWords = knownWords.some(
      (w) => w.english === currentWord.english
    )
      ? knownWords
      : [...knownWords, currentWord];
    setKnownWords(newKnownWords);
    await saveUserData({ knownWords: newKnownWords });

    // زيادة التقدم اليومي وحفظه في Firestore
    const newProgress = dailyProgress + 1;
    setDailyProgress(newProgress);
    const today = new Date().toISOString().split("T")[0];
    const newHistory = [...progressHistory];
    const todayIndex = newHistory.findIndex((d) => d.date === today);
    if (todayIndex !== -1) {
      newHistory[todayIndex].progress = newProgress;
    } else {
      newHistory.push({ date: today, progress: newProgress });
    }
    setProgressHistory(newHistory);
    await saveUserData({
      dailyProgress: newProgress,
      lastLoginDate: today,
      progressHistory: newHistory,
    });

    // الانتقال إلى الكلمة التالية
    nextWord();
  };

  const handleDontKnowWord = () => {
    // إذا كان لا يعرف الكلمة، نبدأ وضع الاختبار
    setTestMode(true);
    // تشغيل الكلمة صوتياً لبدء الاختبار
    playText(currentWord.english);
  };

  const handleTestAnswer = async (isCorrect) => {
    if (isCorrect) {
      // إذا كانت الإجابة صحيحة، نعتبر الكلمة قد تم تعلمها لهذا اليوم
      const newProgress = dailyProgress + 1;
      setDailyProgress(newProgress);
      const today = new Date().toISOString().split("T")[0];
      const newHistory = [...progressHistory];
      const todayIndex = newHistory.findIndex((d) => d.date === today);
      if (todayIndex !== -1) {
        newHistory[todayIndex].progress = newProgress;
      } else {
        newHistory.push({ date: today, progress: newProgress });
      }
      setProgressHistory(newHistory);
      await saveUserData({
        dailyProgress: newProgress,
        lastLoginDate: today,
        progressHistory: newHistory,
      });

      // إضافة الكلمة إلى قائمة الكلمات المعروفة
      const newKnownWords = knownWords.some(
        (w) => w.english === currentWord.english
      )
        ? knownWords
        : [...knownWords, currentWord];
      setKnownWords(newKnownWords);
      await saveUserData({ knownWords: newKnownWords });

      if (unlearnedWords.includes(currentWord.english)) {
        setUnlearnedWords(
          unlearnedWords.filter((w) => w !== currentWord.english)
        );
      }
      nextQuestion();
    } else {
      setShowCorrection(true);
      if (!unlearnedWords.includes(currentWord.english)) {
        setUnlearnedWords((prev) => [...prev, currentWord.english]);
      }
      setTestMode(false);
    }
  };

  const nextQuestion = () => {
    if (currentTestIndex < TEST_TYPES.length - 1) {
      setCurrentTestIndex((prev) => prev + 1);
    } else {
      nextWord();
    }
  };

  const nextWord = () => {
    setShowTranslation(false);
    setCurrentTestIndex(0);
    setTestMode(false); // نعود إلى وضع الدرس بعد كل كلمة
    if (unlearnedWords.length > 0) {
      const nextUnlearnedWord = unlearnedWords[0];
      const nextUnlearnedWordIndex = currentLevel.findIndex(
        (w) => w.english === nextUnlearnedWord
      );
      setCurrentWordIndex(nextUnlearnedWordIndex);
    } else if (currentWordIndex < currentLevel.length - 1) {
      setCurrentWordIndex((prev) => prev + 1);
    } else {
      setShowCompletionModal(true);
    }
  };

  // وظائف جديدة للقصص
  const handleStorySelect = (story) => {
    setSelectedStory(story);
    setViewMode("storyReader");
  };

  const handleReturnToStorySelection = () => {
    setSelectedStory(null);
    setViewMode("storyReading");
  };

  // وظائف جديدة للقواعد النحوية
  const handleGrammarLevelSelect = (levelIndex) => {
    setCurrentGrammarLevelIndex(levelIndex);
    setCurrentRuleIndex(null);
    setViewMode("grammarRules");
  };

  const handleGrammarRuleSelect = (ruleIndex) => {
    setCurrentRuleIndex(ruleIndex);
    setViewMode("grammarLesson");
  };

  const handleReturnToGrammarLevels = () => {
    setCurrentGrammarLevelIndex(null);
    setCurrentRuleIndex(null);
    setViewMode("grammarLevels");
  };

  const handleReturnToGrammarRules = () => {
    setCurrentRuleIndex(null);
    setViewMode("grammarRules");
  };

  // وظائف جديدة للبودكاست
  const handlePodcastLevelSelect = (levelIndex) => {
    setCurrentPodcastLevelIndex(levelIndex);
    setSelectedPodcast(null);
    setViewMode("podcastEpisodes");
  };

  const handleEpisodeSelect = (episode) => {
    setSelectedPodcast(episode);
    setViewMode("podcastPlayer");
  };

  const handleReturnToPodcastLevels = () => {
    setSelectedPodcast(null);
    setCurrentPodcastLevelIndex(null);
    setViewMode("podcastLevels");
  };

  const handleReturnToPodcastEpisodes = () => {
    setSelectedPodcast(null);
    setViewMode("podcastEpisodes");
  };

  // وظائف جديدة للمراجعة
  const handleStartReview = (mode) => {
    if (knownWords.length < 4) {
      alert("يجب أن تتعلم 4 كلمات على الأقل لبدء المراجعة.");
      return;
    }
    const shuffled = [...knownWords].sort(() => 0.5 - Math.random());
    setReviewWords(shuffled);
    setViewMode(mode === "quick" ? "quickReview" : "slowReview");
  };

  // وظيفة جديدة لتوليد موضوع جديد
  const handleGenerateNewTopic = async () => {
    if (!suggestedTopicInput.trim()) {
      alert("الرجاء إدخال موضوع.");
      return;
    }
    setViewMode("generatedTopic");
    setIsLoadingGeneratedContent(true);
    setGeneratedTopicContent(null);

    try {
      // 1. توليد المفردات
      const vocabPrompt = `Generate 5 English vocabulary words for an A2 learner related to the topic "${suggestedTopicInput}". For each word, provide its Arabic translation and a simple English example sentence. Return the result ONLY as a valid JSON array of objects, where each object has "english", "arabic", and "sentence" keys. Do not include any other text, markdown formatting, or explanations outside of the JSON array.`;
      let vocabResponse = await generateText(vocabPrompt);
      // تنظيف الاستجابة للتأكد من أنها JSON صالح
      vocabResponse = vocabResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const words = JSON.parse(vocabResponse);

      // 2. توليد القصة
      const wordList = words.map((w) => w.english).join(", ");
      const storyPrompt = `Write a very short and simple story for an A2 English learner that includes all of the following words: ${wordList}.`;
      const story = await generateText(storyPrompt);

      // 3. توليد الأسئلة
      const questionsPrompt = `Generate 2 multiple-choice questions based on these English words: ${wordList}. For each question, provide the question text in English, 3 options, and the correct answer. Return the result ONLY as a valid JSON array of objects, where each object has "questionEnglish", "options", and "correctAnswer" keys. Do not include any other text, markdown formatting, or explanations.`;
      let questionsResponse = await generateText(questionsPrompt);
      questionsResponse = questionsResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const questions = JSON.parse(questionsResponse);

      setGeneratedTopicContent({
        topic: suggestedTopicInput,
        words,
        story,
        questions,
      });
    } catch (error) {
      console.error("Failed to generate or parse topic content:", error);
      setGeneratedTopicContent(null); // تعيينها إلى null للإشارة إلى وجود خطأ
    } finally {
      setIsLoadingGeneratedContent(false);
    }
  };

  // --- وظائف جديدة للمنهج الدراسي ---
  const handleUnitSelect = (index) => {
    setCurrentUnitIndex(index);
    setViewMode("curriculumUnit");
  };

  const handleReturnToCurriculumHome = () => {
    setCurrentUnitIndex(null);
    setViewMode("curriculumHome");
  };

  const handleUnitCompleted = async (unitId) => {
    const newCompletedUnits = [...completedUnits, unitId];
    setCompletedUnits(newCompletedUnits);
    await saveUserData({ completedUnits: newCompletedUnits });
    alert(`تهانينا! لقد أكملت الوحدة ${unitId}.`);
    handleReturnToCurriculumHome();
  };

  useEffect(() => {
    // --- إصلاح الخطأ: إضافة كائن تكوين Firebase نائب ---
    // إذا كنت تقوم بتشغيل هذا الكود خارجيًا، فاستبدل هذه القيم بقيم مشروع Firebase الخاص بك.
    const firebaseConfig =
      typeof __firebase_config !== "undefined"
        ? JSON.parse(__firebase_config)
        : {
            apiKey: "YOUR_API_KEY",
            authDomain: "YOUR_AUTH_DOMAIN",
            projectId: "YOUR_PROJECT_ID",
            storageBucket: "YOUR_STORAGE_BUCKET",
            messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
            appId: "YOUR_APP_ID",
          };

    const app = initializeApp(firebaseConfig);
    const authInstance = getAuth(app);
    const dbInstance = getFirestore(app);
    const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";
    setAppId(appId);
    setDb(dbInstance);
    setAuth(authInstance);

    const initialAuthToken =
      typeof __initial_auth_token !== "undefined" ? __initial_auth_token : null;
    const setupAuth = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(authInstance, initialAuthToken);
        } else {
          await signInAnonymously(authInstance);
        }
      } catch (error) {
        console.error("Firebase Auth Error:", error);
      }
    };
    setupAuth();

    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthReady && db && userId && appId) {
      const userDocRef = doc(
        db,
        `artifacts/${appId}/users/${userId}/data`,
        "userProgress"
      );
      const today = new Date().toISOString().split("T")[0];

      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDailyGoal(data.dailyGoal || 5);
          setGoalInput(data.dailyGoal || 5);
          setKnownWords(data.knownWords || []);
          setCompletedUnits(data.completedUnits || []);

          let history = data.progressHistory || [];

          // تحديث بيانات اليوم الحالي
          let todayProgress = data.dailyProgress || 0;
          if (data.lastLoginDate !== today) {
            todayProgress = 0;
            saveUserData({ dailyProgress: 0, lastLoginDate: today });
          }

          // تحديث سجل التقدم اليومي
          const todayIndex = history.findIndex((d) => d.date === today);
          if (todayIndex !== -1) {
            history[todayIndex].progress = todayProgress;
          } else {
            history.push({ date: today, progress: todayProgress });
          }
          // الاحتفاظ بآخر 7 أيام فقط
          history = history.slice(-7);
          setProgressHistory(history);
          setDailyProgress(todayProgress);
        } else {
          saveUserData({
            dailyGoal: 5,
            dailyProgress: 0,
            lastLoginDate: today,
            knownWords: [],
            progressHistory: [{ date: today, progress: 0 }],
            completedUnits: [],
          });
        }
      });
      return () => unsubscribe();
    }
  }, [isAuthReady, db, userId, appId]);

  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-500">
          جاري تحميل التطبيق...
        </h1>
      </div>
    );
  }

  const renderContent = () => {
    switch (viewMode) {
      case "home":
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              أهلاً بك في تطبيق تعلم الإنجليزية!
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
              <button
                onClick={() => setViewMode("levelSelection")}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-10 px-4 rounded-lg text-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                الكلمات 📚
              </button>
              <button
                onClick={() => setViewMode("curriculumHome")}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-10 px-4 rounded-lg text-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                المنهج الدراسي 🎓
              </button>
              <button
                onClick={() => setViewMode("conversation")}
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-10 px-4 rounded-lg text-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                تدريب على المحادثة ✨
              </button>
              <button
                onClick={() => setViewMode("grammarExplainer")}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-10 px-4 rounded-lg text-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                شرح القواعد ✨
              </button>
              <button
                onClick={() => setViewMode("storyReading")}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-10 px-4 rounded-lg text-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                القصص 📖
              </button>
              <button
                onClick={() => setViewMode("grammarLevels")}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-10 px-4 rounded-lg text-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                القواعد ✏️
              </button>
              <button
                onClick={() => setViewMode("podcastLevels")}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-10 px-4 rounded-lg text-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                البودكاست 🎙️
              </button>
              <button
                onClick={() => setViewMode("reviewSelection")}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-10 px-4 rounded-lg text-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                المراجعة 🔁
              </button>
              <button
                onClick={() => setViewMode("dashboard")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-10 px-4 rounded-lg text-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                التقدم 📊
              </button>
              <button
                onClick={() => setViewMode("translator")}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-6 px-4 rounded-lg text-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                الترجمة الفورية ✨
              </button>
              <button
                onClick={() => setViewMode("suggestTopic")}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-6 px-4 rounded-lg text-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                توليد درس كامل ✨
              </button>
              <button
                onClick={() => setViewMode("achievements")}
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-6 px-4 rounded-lg text-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                الإنجازات 🏆
              </button>
            </div>
          </div>
        );
      case "levelSelection":
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              اختر المستوى الذي تريد البدء به:
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {Object.keys(OXFORD_DATA).map((level, index) => (
                <button
                  key={index}
                  onClick={() => handleLevelSelect(index)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 px-4 rounded-lg text-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  المستوى {level}
                </button>
              ))}
            </div>
          </div>
        );
      case "topicSelection":
        return (
          currentLevel && (
            <div className="flex flex-col items-center">
              <div className="flex flex-row-reverse justify-between w-full items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 text-center">
                  موضوعات المستوى {Object.keys(OXFORD_DATA)[currentLevelIndex]}:
                </h2>
                <button
                  onClick={handleReturnToLevels}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg"
                >
                  العودة
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 w-full">
                <button
                  onClick={() => handleTopicSelect(0)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-4 rounded-lg text-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  ابدأ تعلم كلمات هذا المستوى
                </button>
              </div>
            </div>
          )
        );
      case "lesson":
        return (
          currentWord &&
          (testMode ? (
            <div className="w-full">
              {currentTest === "writing" && (
                <WritingTest
                  word={currentWord}
                  onAnswer={handleTestAnswer}
                  onSkip={nextWord}
                  showCorrection={showCorrection}
                  setShowCorrection={setShowCorrection}
                />
              )}
              {currentTest === "multiple_choice" && (
                <MultipleChoiceTest
                  word={currentWord}
                  onAnswer={handleTestAnswer}
                  currentTopicWords={currentLevel}
                />
              )}
              {currentTest === "listening" && (
                <ListeningTest
                  word={currentWord}
                  onAnswer={handleTestAnswer}
                  onSkip={nextWord}
                  showCorrection={showCorrection}
                  setShowCorrection={setShowCorrection}
                />
              )}
              {currentTest === "fill_in_the_blank" && (
                <FillInTheBlankTest
                  word={currentWord}
                  onAnswer={handleTestAnswer}
                  onSkip={nextWord}
                />
              )}
            </div>
          ) : (
            <LessonContent
              word={currentWord}
              topicWords={currentLevel}
              level={Object.keys(OXFORD_DATA)[currentLevelIndex]}
              showTranslation={showTranslation}
              onToggleTranslation={() => setShowTranslation(!showTranslation)}
              onReturnToTopics={handleReturnToTopics}
              onKnowWord={handleWordKnown}
              onDontKnowWord={handleDontKnowWord}
              dailyProgress={dailyProgress}
              dailyGoal={dailyGoal}
            />
          ))
        );
      case "storyReading":
        return (
          <StorySelection
            onStorySelect={handleStorySelect}
            onReturn={handleReturnToHome}
          />
        );
      case "storyReader":
        return (
          selectedStory && (
            <StoryReader
              story={selectedStory}
              onReturn={handleReturnToStorySelection}
            />
          )
        );
      case "grammarLevels":
        return (
          <GrammarLevels
            onLevelSelect={handleGrammarLevelSelect}
            onReturn={handleReturnToHome}
          />
        );
      case "grammarRules":
        return (
          currentGrammarLevel && (
            <GrammarRules
              currentLevel={currentGrammarLevel}
              onRuleSelect={handleGrammarRuleSelect}
              onReturn={handleReturnToGrammarLevels}
            />
          )
        );
      case "grammarLesson":
        return (
          currentRule && (
            <GrammarLesson
              rule={currentRule}
              onReturn={handleReturnToGrammarRules}
            />
          )
        );
      case "podcastLevels":
        return (
          <PodcastLevels
            onLevelSelect={handlePodcastLevelSelect}
            onReturn={handleReturnToHome}
          />
        );
      case "podcastEpisodes":
        return (
          currentPodcastLevel && (
            <PodcastEpisodes
              currentLevel={currentPodcastLevel}
              onEpisodeSelect={handleEpisodeSelect}
              onReturn={handleReturnToPodcastLevels}
            />
          )
        );
      case "podcastPlayer":
        return (
          selectedPodcast && (
            <PodcastPlayer
              podcast={selectedPodcast}
              onReturn={handleReturnToPodcastEpisodes}
            />
          )
        );
      case "reviewSelection":
        return (
          <ReviewSelection
            onSelect={handleStartReview}
            onReturn={handleReturnToHome}
          />
        );
      case "quickReview":
        return (
          <QuickReview
            reviewWords={reviewWords}
            onEndReview={handleReturnToHome}
          />
        );
      case "slowReview":
        return (
          <SlowReview
            reviewWords={reviewWords}
            onEndReview={handleReturnToHome}
          />
        );
      case "dashboard":
        return (
          <ProgressDashboard
            dailyGoal={dailyGoal}
            setDailyGoal={(goal) => {
              saveUserData({ dailyGoal: goal });
              setDailyGoal(goal);
            }}
            dailyProgress={dailyProgress}
            setGoalInput={setGoalInput}
            goalInput={goalInput}
            progressHistory={progressHistory}
          />
        );
      case "translator":
        return <Translator onReturn={handleReturnToHome} />;
      case "suggestTopic":
        return (
          <SuggestTopic
            onGenerate={handleGenerateNewTopic}
            setInput={setSuggestedTopicInput}
            inputValue={suggestedTopicInput}
          />
        );
      case "generatedTopic":
        return (
          <GeneratedTopic
            content={generatedTopicContent}
            isLoading={isLoadingGeneratedContent}
            onReturn={() => setViewMode("suggestTopic")}
          />
        );
      case "curriculumHome":
        return (
          <CurriculumHome
            onUnitSelect={handleUnitSelect}
            onReturn={handleReturnToHome}
          />
        );
      case "curriculumUnit":
        return (
          currentUnit && (
            <CurriculumUnit
              unit={currentUnit}
              onReturn={handleReturnToCurriculumHome}
              onUnitCompleted={handleUnitCompleted}
            />
          )
        );
      case "achievements":
        return (
          <Achievements
            knownWordsCount={knownWords.length}
            completedUnitsCount={completedUnits.length}
            onReturn={handleReturnToHome}
          />
        );
      case "conversation":
        return <ConversationPractice onReturn={handleReturnToHome} />;
      case "grammarExplainer":
        return <GrammarExplainer onReturn={handleReturnToHome} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <header className="flex flex-row-reverse justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">
            تطبيق تعلم الإنجليزية
          </h1>
          {viewMode !== "home" && (
            <button
              onClick={handleReturnToHome}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg"
            >
              الرئيسية
            </button>
          )}
        </header>
        {renderContent()}
      </div>
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 shadow-xl text-center">
            <h3 className="text-3xl font-bold text-blue-600 mb-4">تهانينا!</h3>
            <p className="text-lg text-gray-700 mb-6">
              لقد أكملت جميع الدروس بنجاح.
            </p>
            <button
              onClick={() => {
                setShowCompletionModal(false);
                handleReturnToHome();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
