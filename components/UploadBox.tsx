import { UploadCloud } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function UploadBox() {
  const { t } = useLanguage(); // use translation function

  return (
    <div className="w-[100vh] bg-white border border-gray-100 p-6 rounded-md shadow-sm">
      <h2 className="text-xl font-semibold mb-4">{t("files")}</h2>

      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
        <UploadCloud className="mx-auto text-gray-400 mb-2" size={40} />
        <p className="text-gray-700 font-medium">{t("clickUploadOrDrag")}</p>
        <p className="text-sm text-gray-400 mb-4">{t("supportedFileTypes")}</p>
        <button className="text-sm px-4 py-2 border rounded-md hover:bg-gray-100">
          {t("browseFiles")}
        </button>
      </div>
    </div>
  );
}
