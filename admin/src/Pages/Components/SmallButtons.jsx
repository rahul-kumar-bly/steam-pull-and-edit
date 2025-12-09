export const SmallBlueButton = ({ text, tooltip, onClickHandle, classProps }) => {
    const defaultClasses = "bg-[rgb(90,136,175)] text-white text-xs font-bold w-4 h-4 cursor-pointer"
    return (
         <button className={`${defaultClasses} ${classProps}`} type="button" onClick={onClickHandle}  title={tooltip}>
                                                    {text} </button>
    )
};

export const SmallRedButton = ({ text, tooltip, onClickHandle, classProps }) => {
    const defaultClasses = "bg-red-700 text-white text-xs font-bold w-4 h-4 cursor-pointer "
    return (
            <button className={`${defaultClasses} ${classProps}`}
                    type="button" onClick={onClickHandle}  title={tooltip}>
                    {text}
            </button>
    )
}