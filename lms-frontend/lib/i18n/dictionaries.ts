export interface Dictionary {
  nav: {
    courses: string;
    dashboard: string;
    community: string;
    login: string;
    signup: string;
    logout: string;
    newCourse: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    secondaryCta: string;
  };
  stats: {
    students: string;
    courses: string;
    instructors: string;
  };
  coursesSection: {
    title: string;
    subtitle: string;
    viewAll: string;
    empty: string;
  };
  course: {
    by: string;
    lessons: string;
    enroll: string;
    progress: string;
    free: string;
  };
  footer: {
    rights: string;
  };
  auth: {
    or: string;
    google: string;
    login: {
      title: string; subtitle: string; email: string; password: string;
      submit: string; submitting: string; forgot: string; noAccount: string; signupLink: string;
    };
    signup: {
      title: string; subtitle: string; name: string; email: string; password: string;
      role: string; roleStudent: string; roleInstructor: string;
      submit: string; submitting: string; haveAccount: string; loginLink: string;
    };
    verify: {
      title: string; subtitle: string; submit: string; submitting: string;
      resend: string; resendIn: string; success: string;
    };
    forgot: {
      title: string; subtitle: string; email: string; submit: string;
      submitting: string; success: string; backToLogin: string;
    };
    reset: {
      title: string; subtitle: string; newPassword: string;
      submit: string; submitting: string; success: string;
    };
  };
  dashboard: {
    greeting: string;
    subtitle: string;
    stats: {
      total: string; completed: string; inProgress: string;
      hours: string; certificates: string; badges: string;
    };
    myCourses: string;
    noCourses: string;
    certificates: string;
    noCertificates: string;
  };
  coursesPage: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allCategories: string;
    allLevels: string;
    noResults: string;
    prev: string;
    next: string;
  };
  courseDetails: {
    about: string;
    instructor: string;
    reviews: string;
    noReviews: string;
    loginToEnroll: string;
    enrolledCount: string;
    rating: string;
    notFound: string;
    reviewSuccess: string;
    reviewPlaceholder: string;
    submitReview: string;
  };
  checkout: {
    title: string;
    methods: { card: string; wallet: string; kiosk: string };
    mobilePlaceholder: string;
    pay: string;
    processing: string;
    kioskInstruction: string;
    goToDashboard: string;
  };
  learn: {
    noVideo: string;
    markComplete: string;
    marking: string;
    completed: string;
    discuss: string;
    takeQuiz: string;
  };
  community: {
    title: string;
    postsTab: string;
    questionsTab: string;
    postPlaceholder: string;
    publish: string;
    commentPlaceholder: string;
    reply: string;
    noPosts: string;
    questionTitlePlaceholder: string;
    questionBodyPlaceholder: string;
    askQuestion: string;
    answerPlaceholder: string;
    noQuestions: string;
  };
  notifications: {
    title: string;
    markAllRead: string;
    empty: string;
  };
  settings: {
    title: string;
    photoTitle: string;
    changePhoto: string;
    uploadCv: string;
    avatarUpdated: string;
    cvUpdated: string;
    personalTitle: string;
    phone: string;
    save: string;
    saved: string;
    passwordTitle: string;
    currentPassword: string;
    newPassword: string;
    passwordChanged: string;
  };
  quiz: {
    notFound: string;
    duration: string;
    minutes: string;
    true: string;
    false: string;
    essayPlaceholder: string;
    uploadHint: string;
    submit: string;
    answerAll: string;
    yourScore: string;
    pendingGrading: string;
  };
  instructor: {
    newCourseTitle: string;
    courseTitle: string;
    courseDescription: string;
    category: string;
    level: string;
    beginner: string;
    intermediate: string;
    advanced: string;
    price: string;
    thumbnail: string;
    createCourse: string;
    statusUpdated: string;
    published: string;
    draft: string;
    addModule: string;
    moduleTitlePlaceholder: string;
    add: string;
    addLesson: string;
    selectModule: string;
    lessonTitlePlaceholder: string;
    uploading: string;
    lessonAdded: string;
    currentContent: string;
    myCourses: string;
    noCoursesYet: string;
    quizzes: string;
  };
  instructorQuiz: {
    title: string;
    quizTitle: string;
    typeQuiz: string;
    typeExam: string;
    typeTask: string;
    question: string;
    remove: string;
    questionText: string;
    mcq: string;
    truefalse: string;
    essay: string;
    upload: string;
    points: string;
    option: string;
    addOption: string;
    correctAnswer: string;
    addQuestion: string;
    createQuiz: string;
  };
  instructorGrading: {
    graded: string;
    pending: string;
    score: string;
    feedback: string;
    save: string;
    submissionsCount: string;
    noSubmissions: string;
  };
  certificate: {
    eyebrow: string;
    certifyThat: string;
    completed: string;
    print: string;
    notFound: string;
  };
  publicProfile: {
    instructor: string;
    student: string;
    portfolio: string;
    skills: string;
    notFound: string;
  };
}

export const dictionaries: Record<"ar" | "en", Dictionary> = {
  ar: {
    nav: {
      courses: "الكورسات", dashboard: "لوحتي", community: "المجتمع",
      login: "تسجيل الدخول", signup: "إنشاء حساب", logout: "تسجيل الخروج", newCourse: "كورساتي",
    },
    hero: {
      eyebrow: "منصة تعليمية",
      title: "اتعلم مهارة، خطوة بخطوة",
      subtitle: "كورسات عملية من مدربين حقيقيين، مع تتبّع دقيق لتقدّمك من أول درس لحد الشهادة.",
      cta: "استعرض الكورسات",
      secondaryCta: "إزاي بتشتغل المنصة؟",
    },
    stats: { students: "طالب", courses: "كورس", instructors: "مدرب" },
    coursesSection: {
      title: "كورسات مقترحة ليك",
      subtitle: "ابدأ من هنا",
      viewAll: "استعرض كل الكورسات",
      empty: "لسه مفيش كورسات منشورة.",
    },
    course: { by: "بواسطة", lessons: "درس", enroll: "سجّل دلوقتي", progress: "التقدّم", free: "مجاني" },
    footer: { rights: "كل الحقوق محفوظة" },
    auth: {
      or: "أو",
      google: "الدخول بحساب جوجل",
      login: {
        title: "تسجيل الدخول",
        subtitle: "أهلاً بيك تاني، ادخل بياناتك عشان تكمل رحلتك التعليمية.",
        email: "البريد الإلكتروني", password: "كلمة المرور",
        submit: "دخول", submitting: "جارٍ الدخول...",
        forgot: "نسيت كلمة المرور؟", noAccount: "لسه معملتش حساب؟", signupLink: "أنشئ حساب جديد",
      },
      signup: {
        title: "إنشاء حساب جديد",
        subtitle: "ابدأ رحلتك التعليمية دلوقتي، مجانًا.",
        name: "الاسم بالكامل", email: "البريد الإلكتروني", password: "كلمة المرور",
        role: "أنا هنا كـ", roleStudent: "طالب", roleInstructor: "مدرب",
        submit: "إنشاء الحساب", submitting: "جارٍ الإنشاء...",
        haveAccount: "عندك حساب بالفعل؟", loginLink: "سجّل دخولك",
      },
      verify: {
        title: "تأكيد بريدك الإلكتروني",
        subtitle: "بعتنالك كود مكوّن من 6 أرقام على بريدك الإلكتروني.",
        submit: "تأكيد", submitting: "جارٍ التأكيد...",
        resend: "إعادة إرسال الكود", resendIn: "تقدر تطلب كود جديد بعد", success: "تم تأكيد حسابك بنجاح",
      },
      forgot: {
        title: "نسيت كلمة المرور",
        subtitle: "اكتب بريدك الإلكتروني وهنبعتلك كود إعادة التعيين.",
        email: "البريد الإلكتروني", submit: "إرسال الكود", submitting: "جارٍ الإرسال...",
        success: "تم إرسال الكود إلى بريدك الإلكتروني", backToLogin: "الرجوع لتسجيل الدخول",
      },
      reset: {
        title: "إعادة تعيين كلمة المرور",
        subtitle: "اكتب الكود اللي وصلك، وكلمة المرور الجديدة.",
        newPassword: "كلمة المرور الجديدة",
        submit: "تغيير كلمة المرور", submitting: "جارٍ التغيير...", success: "تم تغيير كلمة المرور بنجاح",
      },
    },
    dashboard: {
      greeting: "أهلاً بيك،",
      subtitle: "دي نظرة عامة على رحلتك التعليمية لحد دلوقتي.",
      stats: {
        total: "إجمالي الكورسات", completed: "مكتملة", inProgress: "قيد التقدّم",
        hours: "ساعة تعليمية", certificates: "شهادات", badges: "إنجازات",
      },
      myCourses: "كورساتي", noCourses: "لسه مسجّلتش في أي كورس.",
      certificates: "الشهادات", noCertificates: "لسه معندكش شهادات.",
    },
    coursesPage: {
      title: "استعرض الكورسات",
      subtitle: "دوّر على الكورس المناسب ليك من مجموعتنا.",
      searchPlaceholder: "دوّر عن كورس...",
      allCategories: "كل التصنيفات",
      allLevels: "كل المستويات",
      noResults: "مفيش نتايج مطابقة، جرب تغيّر كلمات البحث أو الفلاتر.",
      prev: "السابق",
      next: "التالي",
    },
    courseDetails: {
      about: "نبذة عن الكورس",
      instructor: "المدرب",
      reviews: "التقييمات",
      noReviews: "لسه مفيش تقييمات على الكورس ده.",
      loginToEnroll: "سجّل دخولك الأول عشان تقدر تسجّل في الكورس",
      enrolledCount: "عدد المسجّلين",
      rating: "التقييم",
      notFound: "الكورس ده مش موجود.",
      reviewSuccess: "تم إضافة تقييمك بنجاح",
      reviewPlaceholder: "اكتب رأيك في الكورس (اختياري)...",
      submitReview: "إرسال التقييم",
    },
    checkout: {
      title: "إتمام الدفع",
      methods: { card: "بطاقة بنكية", wallet: "محفظة إلكترونية (فودافون كاش / InstaPay)", kiosk: "فوري" },
      mobilePlaceholder: "رقم المحفظة (01xxxxxxxxx)",
      pay: "ادفع دلوقتي",
      processing: "جارٍ المعالجة...",
      kioskInstruction: "ادفع الكود ده في أي فرع فوري خلال 24 ساعة",
      goToDashboard: "روح للوحتي",
    },
    learn: {
      noVideo: "مفيش فيديو للدرس ده لسه",
      markComplete: "علّم الدرس كمكتمل",
      marking: "جارٍ الحفظ...",
      completed: "تم إنهاء الدرس ✓",
      discuss: "ناقش الكورس ده مع زمايلك 💬",
      takeQuiz: "ادخل الاختبار 📝",
    },
    community: {
      title: "المجتمع",
      postsTab: "المنشورات",
      questionsTab: "الأسئلة والإجابات",
      postPlaceholder: "اكتب منشور جديد...",
      publish: "نشر",
      commentPlaceholder: "اكتب تعليق...",
      reply: "رد",
      noPosts: "لسه مفيش منشورات، ابدأ إنت الأول.",
      questionTitlePlaceholder: "عنوان السؤال",
      questionBodyPlaceholder: "تفاصيل السؤال...",
      askQuestion: "اسأل سؤال",
      answerPlaceholder: "اكتب إجابة...",
      noQuestions: "لسه مفيش أسئلة، اسأل إنت الأول.",
    },
    notifications: {
      title: "الإشعارات",
      markAllRead: "تحديد الكل كمقروء",
      empty: "مفيش إشعارات لحد دلوقتي.",
    },
    settings: {
      title: "الإعدادات",
      photoTitle: "الصورة الشخصية والـ CV",
      changePhoto: "تغيير الصورة",
      uploadCv: "رفع الـ CV",
      avatarUpdated: "تم تحديث الصورة بنجاح",
      cvUpdated: "تم رفع الـ CV بنجاح",
      personalTitle: "البيانات الشخصية",
      phone: "رقم الهاتف",
      save: "حفظ",
      saved: "تم الحفظ بنجاح",
      passwordTitle: "كلمة المرور",
      currentPassword: "كلمة المرور الحالية",
      newPassword: "كلمة المرور الجديدة",
      passwordChanged: "تم تغيير كلمة المرور بنجاح",
    },
    quiz: {
      notFound: "الاختبار ده مش موجود.",
      duration: "المدة",
      minutes: "دقيقة",
      true: "صح",
      false: "غلط",
      essayPlaceholder: "اكتب إجابتك...",
      uploadHint: "الصق رابط الملف أو اكتب إجابتك هنا",
      submit: "تسليم الإجابات",
      answerAll: "لازم تجاوب على كل الأسئلة الأول",
      yourScore: "درجتك",
      pendingGrading: "تم التسليم، في انتظار التصحيح.",
    },
      instructor: {
      newCourseTitle: "إنشاء كورس جديد",
      courseTitle: "عنوان الكورس",
      courseDescription: "وصف الكورس",
      category: "التصنيف",
      level: "المستوى",
      beginner: "مبتدئ",
      intermediate: "متوسط",
      advanced: "متقدم",
      price: "السعر (ج.م)",
      thumbnail: "صورة الكورس",
      createCourse: "إنشاء الكورس",
      statusUpdated: "تم تحديث حالة الكورس",
      published: "منشور",
      draft: "مسودة",
      addModule: "إضافة موديول",
      moduleTitlePlaceholder: "عنوان الموديول",
      add: "إضافة",
      addLesson: "إضافة درس",
      selectModule: "اختار الموديول",
      lessonTitlePlaceholder: "عنوان الدرس",
      uploading: "جارٍ الرفع...",
      lessonAdded: "تم إضافة الدرس بنجاح",
      currentContent: "محتوى الكورس الحالي",
      myCourses: "كورساتي",
      noCoursesYet: "لسه معملتش أي كورس.",
      quizzes: "الاختبارات",
    },
    instructorQuiz: {
      title: "إنشاء اختبار جديد",
      quizTitle: "عنوان الاختبار",
      typeQuiz: "اختبار قصير",
      typeExam: "امتحان",
      typeTask: "تاسك",
      question: "سؤال",
      remove: "حذف",
      questionText: "نص السؤال",
      mcq: "اختيار من متعدد",
      truefalse: "صح/غلط",
      essay: "مقالي",
      upload: "رفع ملف",
      points: "الدرجة",
      option: "اختيار",
      addOption: "إضافة اختيار",
      correctAnswer: "الإجابة الصحيحة",
      addQuestion: "إضافة سؤال",
      createQuiz: "إنشاء الاختبار",
    },
    instructorGrading: {
      graded: "تم التصحيح",
      pending: "في انتظار التصحيح",
      score: "الدرجة",
      feedback: "ملاحظات",
      save: "حفظ",
      submissionsCount: "تسليم",
      noSubmissions: "لسه محدش سلّم الاختبار ده.",
    },
    certificate: {
      eyebrow: "شهادة إتمام",
      certifyThat: "بنشهد بأن",
      completed: "أكمل بنجاح كورس",
      print: "طباعة الشهادة",
      notFound: "الشهادة دي مش موجودة.",
    },
    publicProfile: {
      instructor: "مدرب",
      student: "طالب",
      portfolio: "البورتفوليو",
      skills: "المهارات",
      notFound: "المستخدم ده مش موجود.",
    },
  },
  en: {
    nav: {
      courses: "Courses", dashboard: "Dashboard", community: "Community",
      login: "Log in", signup: "Sign up", logout: "Log out", newCourse: "My courses",
    },
    hero: {
      eyebrow: "Learning platform",
      title: "Learn a skill, one step at a time",
      subtitle: "Practical courses from real instructors, with precise progress tracking from lesson one to your certificate.",
      cta: "Browse courses",
      secondaryCta: "How it works",
    },
    stats: { students: "students", courses: "courses", instructors: "instructors" },
    coursesSection: {
      title: "Courses picked for you",
      subtitle: "Start here",
      viewAll: "Browse all courses",
      empty: "No published courses yet.",
    },
    course: { by: "By", lessons: "lessons", enroll: "Enroll now", progress: "Progress", free: "Free" },
    footer: { rights: "All rights reserved" },
    auth: {
      or: "or",
      google: "Continue with Google",
      login: {
        title: "Log in",
        subtitle: "Welcome back, enter your details to continue learning.",
        email: "Email address", password: "Password",
        submit: "Log in", submitting: "Logging in...",
        forgot: "Forgot password?", noAccount: "Don't have an account?", signupLink: "Create one",
      },
      signup: {
        title: "Create your account",
        subtitle: "Start your learning journey today, for free.",
        name: "Full name", email: "Email address", password: "Password",
        role: "I'm here as a", roleStudent: "Student", roleInstructor: "Instructor",
        submit: "Create account", submitting: "Creating...",
        haveAccount: "Already have an account?", loginLink: "Log in",
      },
      verify: {
        title: "Verify your email",
        subtitle: "We sent a 6-digit code to your email address.",
        submit: "Verify", submitting: "Verifying...",
        resend: "Resend code", resendIn: "You can request a new code in", success: "Your account has been verified",
      },
      forgot: {
        title: "Forgot password",
        subtitle: "Enter your email and we'll send you a reset code.",
        email: "Email address", submit: "Send code", submitting: "Sending...",
        success: "Reset code sent to your email", backToLogin: "Back to log in",
      },
      reset: {
        title: "Reset password",
        subtitle: "Enter the code you received and your new password.",
        newPassword: "New password",
        submit: "Change password", submitting: "Changing...", success: "Password changed successfully",
      },
    },
    dashboard: {
      greeting: "Welcome back,",
      subtitle: "Here's an overview of your learning journey so far.",
      stats: {
        total: "Total courses", completed: "Completed", inProgress: "In progress",
        hours: "Learning hours", certificates: "Certificates", badges: "Achievements",
      },
      myCourses: "My courses", noCourses: "You haven't enrolled in any course yet.",
      certificates: "Certificates", noCertificates: "You don't have any certificates yet.",
    },
    coursesPage: {
      title: "Browse courses",
      subtitle: "Find the right course for you from our catalog.",
      searchPlaceholder: "Search for a course...",
      allCategories: "All categories",
      allLevels: "All levels",
      noResults: "No matching results, try different keywords or filters.",
      prev: "Previous",
      next: "Next",
    },
    courseDetails: {
      about: "About this course",
      instructor: "Instructor",
      reviews: "Reviews",
      noReviews: "No reviews yet for this course.",
      loginToEnroll: "Log in first to enroll in this course",
      enrolledCount: "Enrolled",
      rating: "Rating",
      notFound: "This course doesn't exist.",
      reviewSuccess: "Your review has been added",
      reviewPlaceholder: "Share your thoughts about the course (optional)...",
      submitReview: "Submit review",
    },
    checkout: {
      title: "Checkout",
      methods: { card: "Bank card", wallet: "Mobile wallet (Vodafone Cash / InstaPay)", kiosk: "Fawry" },
      mobilePlaceholder: "Wallet number (01xxxxxxxxx)",
      pay: "Pay now",
      processing: "Processing...",
      kioskInstruction: "Pay this code at any Fawry outlet within 24 hours",
      goToDashboard: "Go to dashboard",
    },
    learn: {
      noVideo: "No video for this lesson yet",
      markComplete: "Mark lesson as complete",
      marking: "Saving...",
      completed: "Lesson completed ✓",
      discuss: "Discuss this course with peers 💬",
      takeQuiz: "Take the quiz 📝",
    },
    community: {
      title: "Community",
      postsTab: "Posts",
      questionsTab: "Questions & Answers",
      postPlaceholder: "Write a new post...",
      publish: "Publish",
      commentPlaceholder: "Write a comment...",
      reply: "Reply",
      noPosts: "No posts yet, be the first.",
      questionTitlePlaceholder: "Question title",
      questionBodyPlaceholder: "Question details...",
      askQuestion: "Ask a question",
      answerPlaceholder: "Write an answer...",
      noQuestions: "No questions yet, be the first.",
    },
    notifications: {
      title: "Notifications",
      markAllRead: "Mark all as read",
      empty: "No notifications yet.",
    },
    settings: {
      title: "Settings",
      photoTitle: "Profile photo & CV",
      changePhoto: "Change photo",
      uploadCv: "Upload CV",
      avatarUpdated: "Photo updated successfully",
      cvUpdated: "CV uploaded successfully",
      personalTitle: "Personal data",
      phone: "Phone number",
      save: "Save",
      saved: "Saved successfully",
      passwordTitle: "Password",
      currentPassword: "Current password",
      newPassword: "New password",
      passwordChanged: "Password changed successfully",
    },
    quiz: {
      notFound: "This quiz doesn't exist.",
      duration: "Duration",
      minutes: "minutes",
      true: "True",
      false: "False",
      essayPlaceholder: "Write your answer...",
      uploadHint: "Paste a file link or write your answer here",
      submit: "Submit answers",
      answerAll: "Please answer all questions first",
      yourScore: "Your score",
      pendingGrading: "Submitted, awaiting grading.",
    },
    instructor: {
      newCourseTitle: "Create a new course",
      courseTitle: "Course title",
      courseDescription: "Course description",
      category: "Category",
      level: "Level",
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
      price: "Price (EGP)",
      thumbnail: "Course thumbnail",
      createCourse: "Create course",
      statusUpdated: "Course status updated",
      published: "Published",
      draft: "Draft",
      addModule: "Add module",
      moduleTitlePlaceholder: "Module title",
      add: "Add",
      addLesson: "Add lesson",
      selectModule: "Select module",
      lessonTitlePlaceholder: "Lesson title",
      uploading: "Uploading...",
      lessonAdded: "Lesson added successfully",
      currentContent: "Current course content",
      myCourses: "My courses",
      noCoursesYet: "You haven't created any course yet.",
      quizzes: "Quizzes",
    },
    instructorQuiz: {
      title: "Create a new quiz",
      quizTitle: "Quiz title",
      typeQuiz: "Quiz",
      typeExam: "Exam",
      typeTask: "Task",
      question: "Question",
      remove: "Remove",
      questionText: "Question text",
      mcq: "Multiple choice",
      truefalse: "True/False",
      essay: "Essay",
      upload: "File upload",
      points: "Points",
      option: "Option",
      addOption: "Add option",
      correctAnswer: "Correct answer",
      addQuestion: "Add question",
      createQuiz: "Create quiz",
    },
    instructorGrading: {
      graded: "Graded",
      pending: "Pending grading",
      score: "Score",
      feedback: "Feedback",
      save: "Save",
      submissionsCount: "submissions",
      noSubmissions: "No one has submitted this quiz yet.",
    },
    certificate: {
      eyebrow: "Certificate of Completion",
      certifyThat: "This certifies that",
      completed: "has successfully completed",
      print: "Print certificate",
      notFound: "This certificate doesn't exist.",
    },
    publicProfile: {
      instructor: "Instructor",
      student: "Student",
      portfolio: "Portfolio",
      skills: "Skills",
      notFound: "This user doesn't exist.",
    },
  },
};

export type Locale = keyof typeof dictionaries;
