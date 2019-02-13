const reactSelectStyle = {
  control: (base, state) => ({
    ...base,
    fontSize: '0.875rem',
    boxShadow: 'none',
    backgroundColor: state.isDisabled ? '#eee' : '#fff',
    height: '34px',
    minHeight: '34px',
    borderColor: state.isFocused ? '#F66830' : '#C7C7C7',
    ':hover': {
      borderColor: '#F66830'
    }
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
      color: '#707A8B',
      fontSize: '0.875rem'
    }
  },
  singleValue: base => ({
    ...base,
    color: '#707A8B'
  })
}

export default reactSelectStyle