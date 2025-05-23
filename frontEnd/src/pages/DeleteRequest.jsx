// src/pages/DeleteRequest.js

const DeleteRequest = () => {
  return (
    <div className="p-4 max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Account Deletion</h2>
      <p>
        To delete your account, please log in to the app and go to:
        <br />
        <strong>Settings → Delete My Account</strong>
      </p>
      <p className="mt-4">
        Or you may email us at{" "}
        <a
          href="mailto:support@yourdomain.com"
          className="text-blue-600 underline"
        >
          support@konafasheek.com
        </a>
      </p>
    </div>
  );
};

export default DeleteRequest;
