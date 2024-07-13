import React from 'react';

// interfaces
interface IProps {
  children: React.ReactNode;
}

const Slider = ({ children }: IProps): React.JSX.Element => {
  const startX = React.useRef<number>(0);
  const isDown = React.useRef<boolean>(false);
  const scrollLeftX = React.useRef<number>(0);
  const preventClick = React.useRef<boolean>(false);
  const navReference = React.useRef<HTMLDivElement | any>(null);

  const [leftArrowDisable, setLeftArrowDisable] = React.useState<boolean>(true);
  const [rightArrowDisable, setRightArrowDisable] = React.useState<boolean>(false);

  const buttons = (): void => {
    const { offsetWidth, scrollWidth, scrollLeft } = navReference.current;

    const hideLeftScroll: boolean = scrollLeft <= 0;

    const hideRightScroll: boolean = scrollWidth - Math.round(scrollLeft) <= offsetWidth + 1;

    if (hideLeftScroll) {
      setLeftArrowDisable(true);
    } else {
      setLeftArrowDisable(false);
    }

    if (hideRightScroll) {
      setRightArrowDisable(true);
    } else {
      setRightArrowDisable(false);
    }
  };

  const click = (e: MouseEvent): void => {
    if (preventClick.current) {
      e.preventDefault();
    }
  };

  const scroll = React.useCallback(() => {
    buttons();
  }, []);

  const mouseUp = (): void => {
    isDown.current = false;
  };

  const mouseDown = React.useCallback((e: MouseEvent) => {
    e.preventDefault();

    isDown.current = true;

    startX.current = e.pageX - navReference.current.offsetLeft;

    scrollLeftX.current = navReference.current.scrollLeft;

    preventClick.current = false;

    buttons();
  }, []);

  const mouseMove = React.useCallback((e: MouseEvent) => {
    if (!isDown.current) return;

    e.preventDefault();

    const x: number = e.pageX - navReference.current.offsetLeft;

    const walk: number = x - startX.current;

    navReference.current.scrollLeft = scrollLeftX.current - walk;

    preventClick.current = true;

    buttons();
  }, []);

  const mouseLeave = (): void => {
    isDown.current = false;

    preventClick.current = false;
  };

  const handleHorizantalScroll = (speed: number, step: number): void => {
    let scrollAmount: number = 0;

    const slideTimer = setInterval(() => {
      navReference.current.scrollLeft += step;

      scrollAmount += Math.abs(step);

      if (scrollAmount >= 320) {
        clearInterval(slideTimer);
      }

      buttons();
    }, speed);
  };

  React.useEffect(() => {
    buttons();

    const elementRef: HTMLDivElement = navReference.current;

    window.addEventListener('resize', scroll);
    elementRef.addEventListener('click', click);
    elementRef.addEventListener('scroll', scroll);
    elementRef.addEventListener('mouseup', mouseUp);
    elementRef.addEventListener('mousedown', mouseDown);
    elementRef.addEventListener('mousemove', mouseMove);
    elementRef.addEventListener('mouseleave', mouseLeave);

    return () => {
      window.removeEventListener('resize', scroll);
      elementRef.removeEventListener('click', click);
      elementRef.removeEventListener('scroll', scroll);
      elementRef.removeEventListener('mouseup', mouseUp);
      elementRef.removeEventListener('mousedown', mouseDown);
      elementRef.removeEventListener('mousemove', mouseMove);
      elementRef.removeEventListener('mouseleave', mouseLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='scroll-container'>
      {!leftArrowDisable && (
        <div className='left-arrow'>
          <button
            type='button'
            disabled={leftArrowDisable}
            className='button black circle active-opacity'
            onClick={() => {
              handleHorizantalScroll(15, -20);
            }}
          >
            <span className='material-symbols-outlined'>chevron_left</span>
          </button>
        </div>
      )}
      <div className='scrollable flex flex-gap' ref={navReference}>
        {children}
      </div>
      {!rightArrowDisable && (
        <div className='right-arrow'>
          <button
            type='button'
            disabled={rightArrowDisable}
            className='button black circle active-opacity'
            onClick={() => {
              handleHorizantalScroll(15, 20);
            }}
          >
            <span className='material-symbols-outlined'>chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Slider;
