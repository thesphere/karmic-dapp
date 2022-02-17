const Button = ({ action, text, classNames }) => {
  return (
    <button
      className={`button sphere-action-Btn ${classNames}`}
      type="button"
      onClick={action}
    >
      {text}
    </button>
  )
}

export default Button
