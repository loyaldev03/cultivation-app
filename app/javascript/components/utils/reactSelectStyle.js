const reactSelectStyle = {
  control: (base, state) => ({
    ...base,
    fontSize: '0.875rem',
    backgroundColor: state.isDisabled ? '#eee' : '#fff',
    height: '34px',
    minHeight: '34px',
    borderColor: 'rgba(0, 0, 0, 0.2)'
  }),
  indicatorSeparator: () => ({
    display: 'none'
  }),
  menu: (base, state) => ({
    ...base,
    marginTop: 2
  }),
  dropdownIndicator: () => ({
    display: 'inline-block',
    color: 'rgba(100,100,100, 0.2)',
    width: '25px'
  }),
  option: (base, state) => {
    return {
      ...base,
      backgroundColor:
        state.isFocused || state.isSelected
          ? 'rgba(100, 100, 100, 0.1)'
          : 'transparent',
      ':active': 'rgba(100, 100, 100, 0.1)',
      WebkitTapHighlightColor: 'rgba(100, 100, 100, 0.1)',
      color: 'black',
      fontSize: '0.875rem'
    }
  }
}

export default reactSelectStyle
