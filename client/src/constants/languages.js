export const SUPPORTED_LANGUAGES = [
  { id: "c", name: "C" },
  { id: "cpp", name: "C++" },
  { id: "csharp", name: "C#" },
  { id: "java", name: "Java" },
  { id: "python", name: "Python" },
];

export const getLanguageExtension = (languageId) => {
  switch (languageId) {
    case "c": return "c";
    case "cpp": return "cpp";
    case "csharp": return "csharp";
    case "java": return "java";
    case "python": return "python";
    default: return "plaintext";
  }
};

export const getLanguageName = (languageId) => {
  const lang = SUPPORTED_LANGUAGES.find((l) => l.id === languageId);
  return lang ? lang.name : languageId;
};

