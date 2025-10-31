const Achievement = ({ icon, title, description, isGrey = false }) => {
  return (
    <div className="d-flex align-items-center w-100">
      <div className="achievement-icon-wrapper me-3">
        <img
          src={icon}
          alt=""
          className={`achievement-icon${isGrey ? " greyed" : ""}`}
        />
      </div>

      <div className="flex-grow-1">
        <div className="achievement-title">{title}</div>
        {description && <div className="achievement-desc">{description}</div>}
      </div>
    </div>
  );
};

export default Achievement;
