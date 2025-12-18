class Pitanje {
    constructor(id, tekst, tip, odgovori, tacniOdgovori, poeni = 1) {
        this.id = id;
        this.tekst = tekst;
        this.tip = tip; // "radio" ili "text"
        this.odgovori = odgovori;
        this.tacniOdgovori = tacniOdgovori;
        this.poeni = poeni;
    }

    jeTacan(odgovor) {
        const o = odgovor.trim().toUpperCase().replace(/\s+/g, '');
        return this.tacniOdgovori.some(t => {
            const nt = t.toUpperCase().replace(/\s+/g, '');
            return o === nt || o.includes(nt);
        });
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
                    <div class="form-check" data-index="${i}">
                        <input class="form-check-input" type="radio" name="q${this.id}" id="opt${this.id}_${i}" value="${odg}">
                        <label class="form-check-label" for="opt${this.id}_${i}">${slovo}) ${odg}</label>
                    </div>`;
            });
        } else if (this.tip === "text") {
            html += `
                <input type="text" class="form-control input-answer" id="textAnswer${this.id}"
                    placeholder="Upiši tačan odgovor..." autocomplete="off">
                <small class="text-muted d-block mt-2">Jedinice su opcionalne (npr. 16MHz, 16 MHz ili samo 16)</small>
            `;
        }

        html += `</div>`;
        return html;
    }
}

function pustiZvuk(id) {
    const audio = document.getElementById(id);
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }
}

// Omogući zvuk nakon prvog klika (Chrome politika)
let zvukOmogucen = false;
document.body.addEventListener('click', function omoguciZvuk() {
    if (!zvukOmogucen) {
        zvukOmogucen = true;
        document.body.removeEventListener('click', omoguciZvuk);
    }
}, { once: true });

const svaPitanja = [
    new Pitanje(1, "Šta znači PWM na Arduino pinovima označenim sa ~?", "radio", [
        "Pulse Width Modulation – za kontrolu jačine signala (npr. brightness LED-a ili brzina motora)",
        "Power Width Management – za uštedu energije",
        "Pin Width Mode – za širenje pina",
        "Permanent Write Mode – za trajno pisanje"
    ], ["Pulse Width Modulation – za kontrolu jačine signala (npr. brightness LED-a ili brzina motora)"]),

    new Pitanje(2, "Koja funkcija se koristi za postavljanje da li je pin ulaz ili izlaz?", "radio", [
        "digitalWrite()",
        "analogRead()",
        "pinMode()",
        "serialBegin()"
    ], ["pinMode()"]),

    new Pitanje(3, "Koju funkciju koristiš da upališ LED na digitalnom pinu (postaviš HIGH)?", "radio", [
        "digitalRead()",
        "digitalWrite()",
        "analogWrite()",
        "pinMode()"
    ], ["digitalWrite()"]),

    new Pitanje(4, "Šta radi funkcija analogWrite() na PWM pinu?", "radio", [
        "Čita analogni signal sa pina",
        "Šalje PWM signal (vrijednost 0-255) za kontrolu jačine",
        "Postavlja pin kao analogni ulaz",
        "Šalje serijske podatke"
    ], ["Šalje PWM signal (vrijednost 0-255) za kontrolu jačine"]),

    new Pitanje(5, "Šta je UART komunikacija na Arduino (Serial)?", "radio", [
        "Bežična Bluetooth komunikacija",
        "Asinhrona serijska komunikacija (TX/RX) za komunikaciju sa računarom ili drugim uređajima",
        "Analogno-digitalni pretvarač",
        "Protokol za kontrolu motora"
    ], ["Asinhrona serijska komunikacija (TX/RX) za komunikaciju sa računarom ili drugim uređajima"]),

    new Pitanje(6, "Kako spojiti običan button na Arduino da radi ispravno (bez vanjskog pull-up otpornika)?", "radio", [
        "Jedan kraj na 5V, drugi na digitalni pin i na GND preko otpornika",
        "Jedan kraj na GND, drugi na digitalni pin, i u kodu koristiti INPUT_PULLUP",
        "Direktno između 5V i pina",
        "Samo između pina i GND"
    ], ["Jedan kraj na GND, drugi na digitalni pin, i u kodu koristiti INPUT_PULLUP"]),

    new Pitanje(7, "Koja funkcija očitava analognu vrijednost sa pina (npr. potenciometar ili senzor svjetla)?", "radio", [
        "digitalRead()",
        "analogRead()",
        "analogWrite()",
        "Serial.read()"
    ], ["analogRead()"]),

    new Pitanje(8, "Zašto se koristi otpornik u seriji sa LED-om kada ga spajaš na Arduino pin?", "radio", [
        "Da poveća svjetlinu",
        "Da ograniči struju i spriječi pregorevanje LED-a ili pina",
        "Da promijeni boju LED-a",
        "Da ga pretvori u PWM"
    ], ["Da ograniči struju i spriječi pregorevanje LED-a ili pina"]),

    new Pitanje(9, "Šta se dešava ako spojite senzor koji radi na 3.3V direktno na 5V pin Arduino Uno?", "radio", [
        "Radi bolje i brže",
        "Može oštetiti senzor jer je 5V previše za 3.3V logiku",
        "Nema razlike",
        "Senzor neće raditi uopšte"
    ], ["Može oštetiti senzor jer je 5V previše za 3.3V logiku"]),

    new Pitanje(10, "Koju funkciju koristiš na početku sketcha da pokreneš serijsku komunikaciju (npr. za Serial.println)?", "radio", [
        "Serial.start()",
        "Serial.begin()",
        "Serial.open()",
        "Serial.init()"
    ], ["Serial.begin()"]),

    new Pitanje(11, "Možeš li napajati Arduino Uno samo preko USB kabla sa računara?", "radio", [
        "Ne, moraš koristiti eksterni adapter",
        "Da, USB daje dovoljno snage za većinu projekata",
        "Samo ako je računar uključen u struju",
        "Ne, USB je samo za programiranje"
    ], ["Da, USB daje dovoljno snage za većinu projekata"]),

    new Pitanje(12, "Šta znači 'ground' (GND) na Arduino ploči?", "radio", [
        "Pozitivni napon (+5V)",
        "Referentna tačka 0V – zajednička masa za sve komponente",
        "Analogni ulaz",
        "Pin za reset"
    ], ["Referentna tačka 0V – zajednička masa za sve komponente"])
];

let trenutnoPitanje = 0;
let bodovi = 0;
let timerInterval;
let preostaloSekundi = 10 * 60; // 10 minuta
let kvizZavrsen = false;

const STORAGE_KEY = 'arduinoKvizStanja';

const startScreen = document.getElementById('startScreen');
const quizContainer = document.getElementById('quizContainer');
const quizCard = document.getElementById('quizCard');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.querySelector('.progress-bar');
const timerDisplay = document.getElementById('timer');

function sacuvajStanja() {
    if (!kvizZavrsen) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            trenutnoPitanje,
            bodovi,
            preostaloSekundi
        }));
    }
}

function ucitajStanja() {
    const sacuvano = localStorage.getItem(STORAGE_KEY);
    if (sacuvano) {
        const data = JSON.parse(sacuvano);
        trenutnoPitanje = data.trenutnoPitanje || 0;
        bodovi = data.bodovi || 0;
        preostaloSekundi = data.preostaloSekundi || 10 * 60;
        return true;
    }
    return false;
}

function obrisiStanja() {
    localStorage.removeItem(STORAGE_KEY);
}

function azurirajTimerPrikaz() {
    const min = Math.floor(preostaloSekundi / 60).toString().padStart(2, '0');
    const sec = (preostaloSekundi % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${min}:${sec}`;
}

function pokreniTimer() {
    azurirajTimerPrikaz();
    timerDisplay.classList.remove('hidden'); // PRIKAŽI TIMER

    timerInterval = setInterval(() => {
        preostaloSekundi--;
        azurirajTimerPrikaz();
        sacuvajStanja();

        if (preostaloSekundi <= 0) {
            clearInterval(timerInterval);
            zavrsiKviz();
        }
    }, 1000);
}

function zavrsiKviz() {
    clearInterval(timerInterval);
    kvizZavrsen = true;
    obrisiStanja();
    pustiZvuk('nextQuestion');

    document.querySelector('#quiz-section .container').innerHTML = `
        <div class="text-center py-5">
            <h2 class="display-5 mb-4">Kviz završen!</h2>
            <h3 class="mb-3">Osvojili ste ${bodovi} od ${svaPitanja.length} bodova</h3>
            <p class="lead">${Math.round((bodovi / svaPitanja.length) * 100)}% tačnosti</p>
            <button class="btn btn-success btn-lg mt-4" onclick="location.reload()">Igraj ponovo</button>
        </div>`;
}

function prikaziPitanje() {
    const p = svaPitanja[trenutnoPitanje];
    quizCard.innerHTML = p.generisiHTML();

    progressBar.style.width = ((trenutnoPitanje + 1) / svaPitanja.length) * 100 + '%';
    nextBtn.disabled = true;

    if (p.tip === "radio") {
        const formChecks = document.querySelectorAll('.form-check');
        formChecks.forEach(fc => {
            fc.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                const radio = document.getElementById(`opt${p.id}_${index}`);
                if (radio) {
                    radio.checked = true;
                    nextBtn.disabled = false;
                }
            });
        });

        // Ako korisnik direktno klikne na radio button
        document.querySelectorAll(`input[name="q${p.id}"]`).forEach(r => {
            r.addEventListener('change', () => nextBtn.disabled = false);
        });

    } else if (p.tip === "text") {
        const input = document.getElementById(`textAnswer${p.id}`);
        input.focus();
        input.addEventListener('input', () => {
            nextBtn.disabled = (input.value.trim() === '');
        });
    }
}

nextBtn.addEventListener('click', () => {
    const p = svaPitanja[trenutnoPitanje];
    let tacno = false;

    if (p.tip === "radio") {
        const izabrano = document.querySelector(`input[name="q${p.id}"]:checked`);
        if (izabrano && p.tacniOdgovori.includes(izabrano.value)) {
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
    pustiZvuk('nextQuestion');

    trenutnoPitanje++;

    if (trenutnoPitanje < svaPitanja.length) {
        prikaziPitanje();
    } else {
        zavrsiKviz();
    }

    sacuvajStanja();
});

// Start dugme
document.getElementById('startBtn').addEventListener('click', () => {
    startScreen.remove();
    quizContainer.classList.remove('hidden');

    const imaSacuvano = ucitajStanja();

    pokreniTimer();
    prikaziPitanje();

    if (!imaSacuvano) {
        pustiZvuk('nextQuestion');
    }
});

// Ako reloaduješ stranicu, automatski nastavi kviz ako nije završen
window.addEventListener('load', () => {
    if (ucitajStanja() && trenutnoPitanje > 0 && !kvizZavrsen) {
        startScreen.remove();
        quizContainer.classList.remove('hidden');
        pokreniTimer();
        prikaziPitanje();
    }
});