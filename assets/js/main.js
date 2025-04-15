/**
 * Handles the logic for a simple online calculator
 */
const Calculator = (() => {
  const keys = document.querySelectorAll('.key')
  const inputDisplay = document.querySelector('.display .input')
  const outputDisplay = document.querySelector('.display .output')

  let input = ''

  /**
   * Initializes event listeners for calculator keys
   *
   * @returns {void}
   */
  const init = () => {
    keys.forEach(key => {
      key.addEventListener('click', handleKeyClick)
    })
  }

  /**
   * Handles click events for calculator keys
   *
   * @param {Event} event - The click event object
   *
   * @returns {void}
   */
  const handleKeyClick = event => {
    // Get the clicked key and its value
    const key = event.currentTarget
    const keyValue = key.dataset.key

    // Handle different key types
    switch (keyValue) {
      case 'clear':
        clearCalculator()
        break
      case 'backspace':
        handleBackspace()
        break
      case '=':
        calculateResult()
        break
      case 'brackets':
        handleBrackets()
        break
      default:
        if (validateInput(keyValue)) updateInput(keyValue)
    }
  }

  /**
   * Clears the calculator input and output
   *
   * @returns {void}
   */
  const clearCalculator = () => {
    input = ''
    inputDisplay.innerHTML = ''
    outputDisplay.innerHTML = ''
  }

  /**
   * Handles backspace functionality
   *
   * @returns {void}
   */
  const handleBackspace = () => {
    input = input.slice(0, -1)
    inputDisplay.innerHTML = cleanInput(input)
  }

  /**
   * Calculates and displays the result of the current input
   *
   * @returns {void}
   */
  const calculateResult = () => {
    try {
      const result = eval(prepareInput(input))
      outputDisplay.innerHTML = cleanOutput(result)
    } catch (error) {
      outputDisplay.innerHTML = 'Error'
    }
  }

  /**
   * Handles opening and closing brackets
   *
   * @returns {void}
   */
  const handleBrackets = () => {
    // Add opening bracket if none exists or closing bracket if exists
    if (
      !input.includes('(') ||
      (input.includes('(') &&
        input.includes(')') &&
        input.lastIndexOf('(') < input.lastIndexOf(')'))
    )
      input += '('
    // Add closing bracket if opening bracket exists
    else if (
      (input.includes('(') && !input.includes(')')) ||
      (input.includes('(') &&
        input.includes(')') &&
        input.lastIndexOf('(') > input.lastIndexOf(')'))
    )
      input += ')'

    // Update display
    inputDisplay.innerHTML = cleanInput(input)
  }

  /**
   * Validates the input to prevent invalid sequences
   *
   * @param {string} value - The value to validate
   *
   * @returns {boolean} - Whether the input is valid
   */
  const validateInput = value => {
    // Get last input and operators
    const lastInput = input.slice(-1)
    const operators = ['+', '-', '*', '/']

    // Check for duplicate decimal points
    if (value === '.' && lastInput === '.') return false
    // Check for consecutive operators
    if (operators.includes(value) && operators.includes(lastInput)) return false

    // Return true if input is valid
    return true
  }

  /**
   * Updates the input with the new value
   *
   * @param {string} value - The value to append to the input
   *
   * @returns {void}
   */
  const updateInput = value => {
    input += value
    inputDisplay.innerHTML = cleanInput(input)
  }

  /**
   * Cleans the input for display purposes
   *
   * @param {string} rawInput - The raw input string
   *
   * @returns {string} - The cleaned input string
   */
  const cleanInput = rawInput => {
    return rawInput
      .split('')
      .map(char => {
        if (char === '*') return ' <span class="operator">x</span> '
        if (char === '/') return ' <span class="operator">÷</span> '
        if (char === '+') return ' <span class="operator">+</span> '
        if (char === '-') return ' <span class="operator">-</span> '
        if (char === '(') return '<span class="brackets">(</span>'
        if (char === ')') return '<span class="brackets">)</span>'
        if (char === '%') return '<span class="percent">%</span>'
        return char
      })
      .join('')
  }

  /**
   * Cleans the output for display purposes
   *
   * @param {number} rawOutput - The raw output number
   *
   * @returns {string} - The cleaned output string
   */
  const cleanOutput = rawOutput => {
    // Convert output to string
    let outputString = rawOutput.toString()
    // Split integer and decimal parts
    let [integerPart, decimalPart] = outputString.split('.')

    // Add commas to integer part
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    // Return formatted output
    return decimalPart ? `${integerPart}.${decimalPart}` : integerPart
  }

  /**
   * Prepares the input for evaluation by replacing '%' with '/100'
   *
   * @param {string} rawInput - The raw input string
   *
   * @returns {string} - The prepared input string
   */
  const prepareInput = rawInput => {
    return rawInput
      .split('')
      .map(char => (char === '%' ? '/100' : char))
      .join('')
  }

  return { init }
})()

// Initialize the calculator
Calculator.init()
