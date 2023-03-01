interface props {
  onClick?: () => void;
}

const AddButton = ({ onClick }: props) => {
  return (
    <>
      <button className="square-button" onClick={onClick}>
        {/* <!-- Uploaded to: SVG Repo, www.svgrepo.com, Transformed by: SVG Repo Mixer Tools --> */}
        <svg
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0" />

          <g id="SVGRepo_iconCarrier">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13 12.5V19H11.5V12.5H5V11H11.5V4.5H13V11H19.5V12.5H13Z"
              fill="#1F2328"
            />
          </g>
        </svg>
      </button>
    </>
  );
};
export default AddButton;
