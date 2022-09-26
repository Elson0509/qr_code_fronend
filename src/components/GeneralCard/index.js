const GeneralCard = (props) => {
  return (
    <div className={`${props.mb || 'mb-3'} card card-body ${props.bgColor} ${props.addClasses}`}>
      {
        props.title &&
        <h4 className={`${props.titleStyle} h4`}>
          {props.title}
        </h4>
      }
      {props.comentary &&
        <p>
          {props.comentary}
        </p>
      }
      {props.children}
    </div>
  );
};

export default GeneralCard;