function ClassroomButton({ active, classroom, onClick }) {
    return (
        <button onClick={() => onClick(classroom)}>
            <div className="classroom-name">{classroom}</div>
            <div className="classroom-status"></div>
        </button>
    );
}

export default ClassroomButton;