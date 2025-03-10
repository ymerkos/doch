
//B"H
window.formatNumbers = numberizeAwtsmoos;
function numberizeAwtsmoos(str) {
  var nm = str.match(/\D+|\d+/g)
  var result = []
  nm.forEach((a, i, ar) => {
      if(/\d+/.test(a)) {
          /**
              is number.


              NOW: All numbers that have WHITESPACE
              after them AND NON whitespace before them,
              should be sup-ed
          **/
          if(i == 0) {
              result.push(a)
              return;
          }
          var before = ar[i-1]
          if(before[before.length-1] == " ") {
              result.push(a)
              return;
          }

          if(i == ar.length - 1) {
              result.push(`<sup>${a}</sup>`)
              return;
          }

          
          var after = ar[i+1]
          if(after[0] == " ") {
              result.push(`<sup>${a}</sup>`)
              return;
          }
          
      }
      result.push(a)
      
  })
  return result.join("")
}
