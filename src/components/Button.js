function Button({type, text, value, className, color, textColor, handleClick}) {

    function getButtonValue() {
        handleClick(value, type, text);
    }

    let classNames = "";

    switch (text) {
        case '+':
            classNames = `${className ? className + ' ' : ''}button-2-col`;
            break;
        case '-':
            classNames = `${className ? className + ' ' : ''}button-2-col`;
            break;
        case "=":
            classNames = `${className ? className + ' ' : ''}button-2-col`;
            break;
        default:
            classNames = `${className} button-single`;
    }

    return (
        <button className={classNames} 
                style={{backgroundColor: `${color}`, color: `${textColor}`}}
                onClick={getButtonValue}>{text}</button>
            )
};

export default Button;