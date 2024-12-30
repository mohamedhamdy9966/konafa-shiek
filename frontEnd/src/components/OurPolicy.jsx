import { assets } from "../assets/assets";

const PolicyCard = ({ image, title, description, altText }) => (
  <div>
    <img src={image} alt={altText} className="w-12 m-auto mb-5" />
    <p className="font-semibold">{title}</p>
    <p className="text-gray-400">{description}</p>
  </div>
);

const OurPolicy = () => {
  const policies = [
    {
      image: assets.exchange_icon,
      title: "Our Policy",
      description:
        "كسر حاجز الإحراج لدى البعض وتوفير فرصة وحق الاختيار للأشياء التي .يحتاجونها",
      altText: "Exchange Policy Icon",
    },
    {
      image: assets.quality_icon,
      title: "Premium Quality",
      description:
        "كسر حاجز الإحراج لدى البعض وتوفير فرصة وحق الاختيار للأشياء التي .يحتاجونها",
      altText: "Quality Policy Icon",
    },
    {
      image: assets.support_img,
      title: "Customer Support",
      description:
        "كسر حاجز الإحراج لدى البعض وتوفير فرصة وحق الاختيار للأشياء التي .يحتاجونها",
      altText: "Support Policy Icon",
    },
  ];

  return (
    <div
      className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-6 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700"
      dir="rtl"
    >
      {policies.map((policy, index) => (
        <PolicyCard
          key={index}
          image={policy.image}
          title={policy.title}
          description={policy.description}
          altText={policy.altText}
        />
      ))}
    </div>
  );
};

export default OurPolicy;
