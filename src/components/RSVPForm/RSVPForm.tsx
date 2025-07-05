import { useState } from "react";
import Text from "../Text/Text";
import { useAuth } from "../../contexts/AuthContext";
import FileUpload from "../FileUpload/FileUpload";

interface RSVPFormProps {
  onSubmit: (data: { age: number; waiverAgreed: boolean }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function RSVPForm({
  onSubmit,
  onCancel,
  loading = false
}: RSVPFormProps) {
  const { profile } = useAuth();
  const [age, setAge] = useState("");
  const [errors, setErrors] = useState<{
    age?: string;
    waiver?: string;
    file?: string;
  }>({});
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const isFormValid = age.trim() !== "" && file && !uploading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { age?: string; waiver?: string; file?: string } = {};

    if (!age) {
      newErrors.age = "Age is required";
    } else {
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 13 || ageNum > 100) {
        newErrors.age = "Please enter a valid age between 13 and 100";
      }
    }

    if (!file) {
      newErrors.file = "You must upload your signed waiver";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!profile) {
      setErrors({ file: "User profile not loaded. Please refresh." });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    if (file) {
      formData.append("waiver", file);
    }
    try {
      const token = localStorage.getItem("token");
      const baseUrl =
        import.meta.env.VITE_API_URL || "https://api.hackthe6ix.com";
      const res = await fetch(`${baseUrl}/api/action/updateWaiver`, {
        method: "PUT",
        headers: token ? { "X-Access-Token": token } : {},
        body: formData
      });
      if (!res.ok) {
        throw new Error("Failed to upload file");
      }
      setUploading(false);
      onSubmit({ age: parseInt(age), waiverAgreed: true });
    } catch {
      setUploading(false);
      setErrors({ file: "Failed to upload file. Please try again." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Text textType="paragraph-lg" textColor="primary" className="mb-2">
          What is your age?
        </Text>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00887E] focus:border-transparent"
          placeholder="Enter your age"
          min="13"
          max="100"
        />
        {errors.age && (
          <Text textType="paragraph-sm" className="text-red-500 mt-1">
            {errors.age}
          </Text>
        )}
      </div>

      <div className="flex flex-col">
        <Text textType="paragraph-lg" textColor="primary" className="mb-2">
          Upload your signed{" "}
          <a
            href="https://drive.google.com/file/d/1to4eMVKJRom-X7RA7Jdv5eZFIg8JG0Fn/view?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className="text-[#00887E] underline hover:no-underline"
          >
            waiver
          </a>
          :
        </Text>
        <FileUpload
          onChange={(f) => {
            setFile(f);
            setErrors((prev) => ({ ...prev, file: undefined }));
          }}
          value={file}
          accept="application/pdf"
          // backgroundColor="black"
          // textColor="red"
        />
        {errors.file && (
          <Text textType="paragraph-sm" className="text-red-500 mt-1">
            {errors.file}
          </Text>
        )}
      </div>

      <div className="flex gap-4 justify-center mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading || uploading}
          className="bg-white text-[#00887E] border border-[#00887E] rounded-xl font-bold text-[16px] py-2 px-4 flex-1 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="bg-[#00887E] text-white rounded-xl font-bold text-[16px] py-2 px-4 flex-1 disabled:opacity-50"
        >
          {loading || uploading ? "Submitting..." : "Accept Invitation"}
        </button>
      </div>
    </form>
  );
}
