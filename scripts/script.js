document.querySelectorAll('input[name="q1"]').forEach(radio => {
    radio.addEventListener('change', function() {
            document.getElementById('nextBtn').disabled = false;
        });
});

document.getElementById('nextBtn').addEventListener('click', function() {
    alert("Odlično! Prelazimo na sljedeće pitanje... (ovdje dodaj logiku kviza)");
});