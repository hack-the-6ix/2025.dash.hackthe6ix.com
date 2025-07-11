import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHt6, type ApiResponse } from "../../api/client.ts";
import Text from "../../components/Text/Text";

function DiscordLink() {
  const [error, setError] = useState<{
    message: string;
    status: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getOAuthLink = async () => {
      try {
        const response = await fetchHt6<
          ApiResponse<string>,
          { redirectUrl: string }
        >("/api/action/discordOAuthUrl", {
          method: "POST",
          body: {
            redirectUrl:
              window.location.protocol +
              "//" +
              window.location.host +
              "/discord/callback"
          }
        });

        if (response.message && response.message.startsWith("http")) {
          window.location.href = response.message;
          return;
        }

        setError({
          message: (response.message as string) || "Unknown Error",
          status: response.status
        });
      } catch (err: any) {
        setError({
          message: err.message || "Unknown Error",
          status: err.status || 501
        });
      } finally {
        setLoading(false);
      }
    };

    getOAuthLink();
  }, []);

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          gap: "1rem"
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#e74c3c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "20px"
          }}
        >
          ✕
        </div>
        <Text textType="heading-sm" textColor="orange">
          Something is bonked D:
        </Text>
        <Text textType="paragraph-lg" textColor="gray">
          Looks like something unexpected has happened. Please reload the page
          or try again later...
        </Text>
        <Text textType="paragraph-sm" textColor="gray">
          [{error.status} - {error.message}]
        </Text>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        gap: "1rem"
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #3498db",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}
      />
      <Text textType="heading-sm" textColor="primary">
        Hang in there!
      </Text>
      <Text textType="paragraph-lg" textColor="gray">
        You'll be redirected shortly...
      </Text>
    </div>
  );
}

export default DiscordLink;
