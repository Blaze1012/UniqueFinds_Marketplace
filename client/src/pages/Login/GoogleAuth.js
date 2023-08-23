import React from "react";
import { Button } from "antd";

const ContinueWithGoogleButton = () => {
  return (
    <div className="flex justify-center mt-2">
      <Button
        type="primary"
        icon={
          <img
            src="https://res.cloudinary.com/dufl26uv9/image/upload/f_auto,q_auto/bztllettxa3eaclrnnma"
            alt="Google Icon"
            className="mr-2 h-6 w-6 shadow-md"
          />
        }
        href="/auth/google"
        className="flex items-center justify-center space-x-2 p-4 bg-blue-500"
      >
        Continue with Google
      </Button>
    </div>
  );
};

export default ContinueWithGoogleButton;
