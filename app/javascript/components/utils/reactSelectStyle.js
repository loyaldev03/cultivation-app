const reactSelectStyle = {
  control: (styles, { isFocused, isDisabled }) => ({
    ...styles,
    fontSize: '0.875rem',
    boxShadow: 'none',
    height: '34px',
    minHeight: '34px',
    backgroundColor: isDisabled ? '#eee' : '#fff',
    borderColor: isFocused ? '#F66830' : '#C7C7C7',
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
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    fontSize: '0.875rem',
    color: isFocused ? '#FFFFFF' : '#707A8B',
    backgroundColor: isFocused ? '#F66830' : 'transparent',
    WebkitTapHighlightColor: 'rgba(100, 100, 100, 0.1)',
    ':active': {
      backgroundColor: isSelected
        ? 'rgba(246, 104, 48, 0.8)'
        : 'rgba(246, 104, 48, 1)'
    }
  }),
  singleValue: styles => ({
    ...styles,
    color: '#707A8B'
  })
}

export default reactSelectStyle
