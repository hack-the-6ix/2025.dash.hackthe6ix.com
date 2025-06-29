import { useState } from "react";
import Text from "../Text/Text";

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
  const [age, setAge] = useState("");
  const [waiverAgreed, setWaiverAgreed] = useState(false);
  const [errors, setErrors] = useState<{ age?: string; waiver?: string }>({});

  const isFormValid = age.trim() !== "" && waiverAgreed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { age?: string; waiver?: string } = {};

    if (!age) {
      newErrors.age = "Age is required";
    } else {
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 13 || ageNum > 100) {
        newErrors.age = "Please enter a valid age between 13 and 100";
      }
    }

    if (!waiverAgreed) {
      newErrors.waiver = "You must agree to the waiver to continue";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ age: parseInt(age), waiverAgreed });
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

      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="waiver"
          checked={waiverAgreed}
          onChange={(e) => setWaiverAgreed(e.target.checked)}
          className="mt-1 h-4 w-4 text-[#00887E] focus:ring-[#00887E] border-gray-300 rounded"
        />
        <label htmlFor="waiver" className="flex-1">
          <Text textType="paragraph-lg" textColor="primary">
            I agree to the{" "}
            <a
              href="#"
              className="text-[#00887E] underline hover:no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hack the 6ix waiver and terms of participation
            </a>
          </Text>
        </label>
      </div>
      {errors.waiver && (
        <Text textType="paragraph-sm" className="text-red-500 mt-1">
          {errors.waiver}
        </Text>
      )}

      <div className="flex gap-4 justify-center mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="bg-white text-[#00887E] border border-[#00887E] rounded-xl font-bold text-[16px] py-2 px-4 flex-1 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="bg-[#00887E] text-white rounded-xl font-bold text-[16px] py-2 px-4 flex-1 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Accept Invitation"}
        </button>
      </div>
    </form>
  );
}
