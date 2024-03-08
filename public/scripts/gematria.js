/* B"H

*/

export default calculateGematria;
function calculateGematria(hebrewString, convertNumbers = false) {
    const gematriaMap = {
        'א': 1,
        'ב': 2,
        'ג': 3,
        'ד': 4,
        'ה': 5,
        'ו': 6,
        'ז': 7,
        'ח': 8,
        'ט': 9,
        'י': 10,
        'כ': 20,
        'ך': 20, // Final kaf
        'ל': 30,
        'מ': 40,
        'ם': 40, // Final mem
        'נ': 50,
        'ן': 50, // Final nun
        'ס': 60,
        'ע': 70,
        'פ': 80,
        'ף': 80, // Final pe
        'צ': 90,
        'ץ': 90, // Final tzadi
        'ק': 100,
        'ר': 200,
        'ש': 300,
        'ת': 400
    };
  
  
    // Function to convert English numbers to Hebrew equivalents
    function convertNumberToHebrew(number) {
        const numberMap = {
            1: 'א',
            2: 'ב',
            3: 'ג',
            4: 'ד',
            5: 'ה',
            6: 'ו',
            7: 'ז',
            8: 'ח',
            9: 'ט',
            10: 'י',
            15: "טו",
            16: "טז",
          
            20: 'כ',
            30: 'ל',
            40: 'מ',
            50: 'נ',
            60: 'ס',
            70: 'ע',
            80: 'פ',
            90: 'צ',
            100: 'ק',
            200: 'ר',
            300: 'ש',
            400: 'ת'
        };
        return numberMap[number];
    };
  
  
    // Convert English numbers to Hebrew equivalents if requested
    if (convertNumbers) {
      let gematriaValue = "";
          const numbers = hebrewString.match(/\d+/g); // Extract English numbers from the string
          if (numbers) {
              numbers.forEach(number => {
                gematriaValue += " "
                if(number == 15 ) {
                  gematriaValue += ("טו");
                  return;
                }
                if(number == 16 ) {
                  gematriaValue += ("טז");
                  return;
                }
                const digits = number.toString().split(''); // Get individual digits of the number
                const length = digits.length;
                digits.forEach((digit, index) => {
                    const heb = convertNumberToHebrew(parseInt(digit + '0'.repeat(length - index - 1))); // Convert digit to Hebrew
                    
                    if (heb) {
                        gematriaValue += heb;
                    }
                });
            });
          }
  

          return gematriaValue.trim().split(" ").map(w=>addDoubleQuote(w)).join(" ");
    } else {
      
      let gematriaValue = 0;
        // Iterate through each character in the Hebrew string
        for (let i = 0; i < hebrewString.length; i++) {
          const letter = hebrewString[i];
  
          // Check if the letter exists in the gematria map
          if (gematriaMap.hasOwnProperty(letter)) {
              // Add the gematria value of the letter to the total
              gematriaValue += gematriaMap[letter];
          }
      }
      
      return gematriaValue;
    }
  
  }



  function addDoubleQuote(str) {
    // Convert the string to an array of characters
    const chars = str.split('');
    
    // Insert the double quote at the second-to-last position
    chars.splice(-1, 0, '"');

    // Join the array back into a string and return
    return chars.join('');
}