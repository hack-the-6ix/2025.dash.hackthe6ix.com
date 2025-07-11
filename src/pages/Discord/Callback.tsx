import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchHt6, type ApiResponse } from "../../api/client.ts";
import Text from "../../components/Text/Text";
import { type Profile } from "../../components/types.ts";

interface QueryParams {
  code: string;
  session_state: string;
  state: string;
}

function DiscordCallback() {
  const [error, setError] = useState<{
    message: string;
    status: number;
  } | null>(null);
  console.log(error);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const state = params.state;
    const code = params.code;

    if (!state || !code) {
      setError({
        message: "Missing required parameters",
        status: 400
      });
      setLoading(false);
      return;
    }

    const associateDiscord = async () => {
      try {
        const response = await fetchHt6<
          ApiResponse<string>,
          { state: string; code: string }
        >("/api/action/associateDiscord", {
          method: "POST",
          body: {
            state,
            code
          }
        });

        if (response.status === 200) {
          setSuccess(true);
          setSearchParams(new URLSearchParams());
          window.location.href = "https://go.hackthe6ix.com/2025-discord";
        } else if (
          response.status === 400 &&
          response.message === "no permissions"
        ) {
          window.location.href = "https://go.hackthe6ix.com/2025-discord";
        } else {
          setError({
            message: (response.message as string) || "Unknown Error",
            status: response.status
          });
        }
      } catch (err: any) {
        setError({
          message: err.message || "Unknown Error",
          status: err.status || 501
        });
      } finally {
        setLoading(false);
      }
    };

    associateDiscord();
  }, [searchParams, setSearchParams]);

  if (loading) {
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
          We're processing your Discord association...
        </Text>
      </div>
    );
  }

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

  if (success) {
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
            backgroundColor: "#27ae60",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "20px"
          }}
        >
          ✓
        </div>
        <Text textType="heading-sm" textColor="green">
          Success!
        </Text>
        <Text textType="paragraph-lg" textColor="gray">
          Your account has been successfully linked.
        </Text>
        <Text textType="paragraph-sm" textColor="gray">
          Redirecting to Discord...
        </Text>
      </div>
    );
  }

  return null;
}

export default DiscordCallback;
