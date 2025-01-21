import React, { useState } from "react";
import "./HelpTemplate.css";

const HelpTemplate = () => {
  const handleEmailClick = () => {
    const userConfirmed = window.confirm(
      "Do you want to open your email app to contact support?"
    );
    if (userConfirmed) {
      window.location.href = "mailto:support@company.com?subject=Help%20Request&body=Describe%20your%20issue%20here.";
    }
  };

  const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleFAQ = () => setIsOpen(!isOpen);

    return (
      <div className="faq-item">
        <div className="faq-question" onClick={toggleFAQ}>
          <h4>{question}</h4>
          <span className="arrow">{isOpen ? "▲" : "▼"}</span>
        </div>
        {isOpen && <p className="faq-answer">{answer}</p>}
      </div>
    );
  };

  return (
    <div className="help-container">
      <h2>Need some help?</h2>
      <div className="faq-section">
        <h3>Frequently Asked Questions</h3>
        <FAQItem
          question="Who is this website for?"
          answer="This website is designed for individuals looking to discover and connect with communities that share their interests and passions.
           Whether you are seeking to join a local group, build meaningful connections, or explore new opportunities for collaboration, this platform provides the tools to help you engage with like-minded people and foster genuine connections."
        />
        <FAQItem
          question="How do I Connect with people?"
          answer="You can connect with people via the chat feauture! or if youre a in person type of person you can join a local group and meet people in person."
        />
        <FAQItem
          question="Where can I find Communites that suit my interest?"
          answer="We have a search bar that you can use to search for communities that suit your interest. You can also use the filter to narrow down your search."
        />
        <FAQItem
          question="What should I do if I encounter an issue?"
          answer="If you encounter an issue, please contact support using the button above. Be sure to describe your issue in detail."
        />
      </div>
      <button onClick={handleEmailClick} className="email-button">
        Contact Support
      </button>
    </div>
  );
};

export default HelpTemplate;
