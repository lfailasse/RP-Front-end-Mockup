import './Head.css';

export const Head = (props) => {
    return (
        <div className="head_div">
            <h1>{props.title}</h1>
        </div>
    )
}