function Display({text, memoryText}) {
    return (
        <>
            <div className="Display-panel">
                <p className="Display-text">{text}</p>
            </div>
            <div className="memory-panel">
                <p className="memory-text">{ memoryText }</p>
            </div>
        </>
    );
}

export default Display;
