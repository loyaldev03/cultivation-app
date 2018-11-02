export const selectStyles = {
  control: (styles, { isFocused }) => ({
    ...styles,
    fontSize: '17px',
    boxShadow: 'none',
    ':hover': {
      borderColor: '#F66830'
    },
    borderColor: isFocused ? '#F66830' : '#C7C7C7'
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    fontSize: '17px',
    color: isFocused ? '#FFFFFF' : '#707A8B',
    backgroundColor: isFocused ? '#F66830' : 'transparent',
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
