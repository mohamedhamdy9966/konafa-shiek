import { useState } from "react";

const NewsLetterBox = () => {
  const [message, setMessage] = useState("");

  const onSubmitHandler = (event) => {
    event.preventDefault();
    // Add your API call or logic here
    setMessage("Thank you for subscribing!");
  };

  return (
    <div className="text-center px-4">
      <p className="text-2xl font-medium text-gray-800">
        اشترك معنا في نشرة أخبار كنافة شيك
      </p>
      <p className="text-gray-400 mt-3">
        ابقَ على اطلاع بأحدث العروض والتخفيضات لدينا.
      </p>

      <form
        onSubmit={onSubmitHandler}
        autoComplete="true"
        className="w-full sm:w-1/2 flex flex-col sm:flex-row items-center gap-3 mx-auto my-6 border pl-3 py-2"
      >
        <label htmlFor="email" className="sr-only">
          عنوان بريدك الإلكتروني
        </label>
        <input
          id="email"
          className="w-full sm:flex-1 outline-none px-2 py-3 text-sm border-0"
          type="email"
          placeholder="Enter Your Email"
          required
        />
        <button
          type="submit"
          className="bg-black text-white text-xs px-6 py-3 w-full sm:w-auto"
        >
          Subscribe
        </button>
      </form>

      {message && (
        <p className="text-green-600 mt-3 text-sm" aria-live="polite">
          {message}
        </p>
      )}
    </div>
  );
};

export default NewsLetterBox;
