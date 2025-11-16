let isGenerating = false;

const lowerLetters = [
  'a','b','c','d','e','f','g','h','i','j','k','l','m',
  'n','o','p','q','r','s','t','u','v','w','x','y','z'
];

const upperLetters = [
  'A','B','C','D','E','F','G','H','I','J','K','L','M',
  'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
];

const digits = ['0','1','2','3','4','5','6','7','8','9'];

const symbols = [
  '!','@','#','$','%','^','&','*','(',')','-','_','=','+',
  '[',']','{','}',';',':','"',"'","<",'>','.',',','/','?','|','~','`'
];

let mixedChars = [...lowerLetters, ...upperLetters, ...digits, ...symbols];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

mixedChars = shuffle(mixedChars);

function isused_chars(checkbox_id){
    return document.getElementById(checkbox_id).checked;
}

function usable_chars() {
    let chars = [];
    if(isused_chars("lower")){
        chars = chars.concat(lowerLetters);
    }
    if(isused_chars("upper")){
        chars = chars.concat(upperLetters);
    }
    if(isused_chars("digits")){
        chars = chars.concat(digits);
    }
    if(isused_chars("symbols")){
        chars = chars.concat(symbols);
    }
    return chars;
}

function password_length() {
    let val = document.getElementById("password-length").value;
    if(val.length === 0) return null;
    val = Number(val);
    if(val <= 0) return null;
    return val;
}

function random_char(chars) {
    let idx = Math.floor(Math.random() * chars.length);
    return chars[idx];
}

function passwords(chars){
    let password1 = "";
    let password2 = "";
    let length = password_length();

    for(let i=0; i<length; i++){
        password1 += random_char(chars);
        password2 += random_char(chars);
    }

    return [password1, password2];
}

async function show_password(password, password_id) {
    const password_el = document.getElementById(password_id);
    let cur = "";

    for (let i = 0; i < password.length; i++) {
        for (let j = 0; j < mixedChars.length; j++) {
            let temp = cur + mixedChars[j];
            password_el.textContent = temp;

            await new Promise(resolve => setTimeout(resolve, 3));

            if (mixedChars[j] === password[i]) {
                cur += mixedChars[j];
                break;
            }
        }
    }

    password_el.textContent = password;
}

async function generate_passwords() {
    if(isGenerating) return;
    isGenerating = true;

    let length_div = document.getElementById("length-div");
    let chars_div = document.getElementById("controls-right");

    length_div.style.borderColor = "#969696";
    chars_div.style.borderColor = "#969696";

    let chars = usable_chars();
    let length = password_length();
    let isMissing = false;
    if(length === null){
        isMissing = true;
        length_div.style.borderColor = "red";
    }
    if(chars.length === 0){
        isMissing = true;
        chars_div.style.borderColor = "red";
    }
    if(isMissing){
        isGenerating = false;
        return;
    }

    let [password1, password2] = passwords(chars);
    console.log(password1, ' ', password2);

    await Promise.all([
        show_password(password1, "password-1"),
        show_password(password2, "password-2")
    ]);
    isGenerating = false;
}


const input = document.getElementById("password-length");

input.addEventListener("focus", () => {
    input.value = "";
});

const password_divs = document.querySelectorAll(".password-div");

password_divs.forEach(div => {
    div.addEventListener("click", () => {
        navigator.clipboard.writeText(div.textContent)
            .then(() => {
                div.style.backgroundColor = "#ffffff";
                div.style.transform = "scale(1.05)";
                setTimeout(() => {
                    div.style.backgroundColor = "";
                    div.style.transform = "";
                }, 200);
            })
            .catch(err => console.error("Eroare la copiere:", err));
    });
});