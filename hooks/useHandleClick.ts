interface IUseHandleClick {
  onClickEvent: () => void;

}
export const useHandleClick = ({ onClickEvent }: IUseHandleClick) => {
  const handleClick = () => {
    onClickEvent();
  };
  return { handleClick };
}