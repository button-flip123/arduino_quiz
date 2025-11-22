class Pitanje {
    constructor(id, tekst, tip, odgovori, tacniOdgovori, poeni = 1) {
        this.id = id;
        this.tekst = tekst;
        this.tip = tip;
        this.odgovori = odgovori;
        this.tacniOdgovovori = tacniOdgovori;
        this.poeni = poeni;
    }

    jeTacan(odgovor) {
        const o = odgovor.trim().toUpperCase();
        return this.tacniOdgovovori.some(t => t.toUpperCase() === o || o.includes(t.toUpperCase()));
    }

    generisiHTML() {
        let html = `
            <div class="question-number">${this.id}</div>
            <h4 class="mb-4 fw-bold">${this.tekst}</h4>
            <div class="text-start">
        `;

         if (this.tip === "radio") {
            this.odgovori.forEach((odg, i) => {
                const slovo = String.fromCharCode(65 + i);
                html += `
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="q${this.id}" id="opt${i}" value="${odg}">
                        <label class="form-check-label" for="opt${i}">${slovo}) ${odg}</label>
                    </div>`;
                });
        } 
        else if (this.tip === "text") {
            html += `
                <input type="text" class="form-control input-answer" id="textAnswer${this.id}"
                    placeholder="Upiši tačan odgovor..." autocomplete="off">
                <small class="text-muted d-block mt-2">Npr. 14, A0-A5, ATMEGA328P, 40MA...</small>
            `;
        }

        html += `</div>`;
        return html;
    }
}

// Funkcije za puštanje zvuka
function pustiZvuk(id) {
    const audio = document.getElementById(id);
    if (audio) {
        audio.currentTime = 0;  // resetuje na početak
        audio.play().catch(() => {}); // Chrome blokira autoplay ako nema interakcije, ali poslije prvog klika radi
    }
}

// Omogući autoplay poslije prvog korisničkog klika (Chrome politika)
let zvukOmogucen = false;
document.body.addEventListener('click', function omoguciZvuk() {
    if (!zvukOmogucen) {
        zvukOmogucen = true;
        pustiZvuk('zvukSljedece'); // mali test zvuk
        document.body.removeEventListener('click', omoguciZvuk);
    }
}, { once: true });

const svaPitanja = [
    new Pitanje(1, "Koje je radno napajanje Arduino Uno ploče?", "radio", ["3.3 V", "5 V", "12 V", "9 V"], ["5 V"]),
    new Pitanje(2, "Koliko digitalnih pinova ima Arduino Uno?", "text", [], ["14", "D0-D13"]),
    new Pitanje(3, "Koliko analognih ulaza ima Arduino Uno?", "text", [], ["6", "A0-A5"]),
    new Pitanje(4, "Kako se zove glavni mikrokontroler na Uno R3?", "text", [], ["ATMEGA328P", "ATmega328P", "328P"]),
    new Pitanje(5, "Koji pinovi podržavaju PWM (označeni sa ~)?", "text", [], ["3,5,6,9,10,11", "~3 ~5 ~6 ~9 ~10 ~11"]),
    new Pitanje(6, "Koji pinovi se koriste za hardverski UART (Serial)?", "radio", ["Pin 0 i 1", "Pin 2 i 3", "Pin A4 i A5", "Svi pinovi"], ["Pin 0 i 1"]),
    new Pitanje(7, "Maksimalna struja po digitalnom pinu?", "text", [], ["40MA", "40mA", "40 MA"]),
    new Pitanje(8, "Koliko RAM memorije ima ATmega328P?", "text", [], ["2KB", "2 KB", "2048"]),
    new Pitanje(9, "Koja je frekvencija takta Arduino Uno?", "text", [], ["16MHZ", "16 MHz", "16"]),
    new Pitanje(10, "Kako se zove USB-to-Serial čip na Uno R3?", "text", [], ["ATMEGA16U2", "16U2", "ATmega16U2"]),
    new Pitanje(11, "Koliko EEPROM memorije ima?", "text", [], ["1KB", "1024", "1 KB"]),
    new Pitanje(12, "Koja funkcija se koristi za digitalno očitavanje pina?", "radio", ["analogRead()", "digitalRead()", "pinMode()", "digitalWrite()"], ["digitalRead()"]),
    new Pitanje(13, "Koliko Flash memorije ima za program?", "text", [], ["32KB", "32 KB"]),
    new Pitanje(14, "Može li se Arduino napajati preko Vin pina sa 9V?", "radio", ["Da", "Ne", "Samo preko USB-a"], ["Da"]),
    new Pitanje(15, "Kako se resetuje Arduino Uno?", "radio", ["Pritiskom na RESET dugme", "Isključivanjem napajanja", "Oboje je tačno", "Samo preko serijskog porta"], ["Oboje je tačno"])
];

let trenutnoPitanje = 0;
let bodovi = 0;

const quizCard = document.getElementById('quizCard');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.querySelector('.progress-bar');

function prikaziPitanje() {
    const p = svaPitanja[trenutnoPitanje];
    quizCard.innerHTML = p.generisiHTML();

    const procenat = ((trenutnoPitanje + 1) / svaPitanja.length) * 100;
    progressBar.style.width = procenat + '%';

    nextBtn.disabled = true;

    if (p.tip === "radio") {
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', () => nextBtn.disabled = false);
        });
    } 
    else {
        const input = document.getElementById(`textAnswer${p.id}`);
        input.focus();
        input.addEventListener('input', () => {
            nextBtn.disabled = input.value.trim() === '';
        });
    }
}

nextBtn.addEventListener('click', () => {
    const p = svaPitanja[trenutnoPitanje];
    let tacno = false;

    if (p.tip === "radio") {
        const izabrano = document.querySelector(`input[name="q${p.id}"]:checked`);
        if (izabrano && p.tacniOdgovovori.includes(izabrano.value)) {
            tacno = true;
        }
    } else {
        const input = document.getElementById(`textAnswer${p.id}`);
        if (p.jeTacan(input.value)) {
            input.classList.add('correct');
            tacno = true;
        } else {
            input.classList.add('incorrect');
        }
    }

    if (tacno) bodovi += p.poeni;

    // ZVUK KAD PRELAZI NA SLEDEĆE PITANJE
    if (zvukOmogucen){ 
        pustiZvuk('nextQuestion');
    }

    trenutnoPitanje++;
    if (trenutnoPitanje < svaPitanja.length) {
        prikaziPitanje();
    } 
    else {
        document.querySelector('#quiz-section .container').innerHTML = `
            <div class="text-center py-5">
                <h2 class="text-success">Čestitamo!</h2>
                <h3>Osvojili ste ${bodovi} od ${svaPitanja.reduce((s,p) => s + p.poeni, 0)} bodova</h3>
                <button class="btn btn-success btn-lg mt-4" onclick="location.reload()">Igraj ponovo</button>
            </div>`;
    }
});

prikaziPitanje();