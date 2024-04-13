const express = require('express');
const mysql = require('mysql');

const app = express();

// Verbindung zur Datenbank herstellen
const connection = mysql.createConnection({
  host: 'database', // Name des Datenbankcontainers in Docker-Compose
  user: 'root',
  password: 'example',
  database: 'meineDatenbank'
});

// Verbindung zur Datenbank herstellen
connection.connect((err) => {
  if (err) {
    console.error('Fehler beim Verbinden mit der Datenbank:', err);
    return;
  }
  console.log('Erfolgreich mit der Datenbank verbunden');
});

// Middleware für das Verarbeiten von Formulardaten
app.use(express.urlencoded({ extended: true }));

// Routen definieren
app.get('/', (req, res) => {
  // Daten aus der Datenbank abrufen
  connection.query('SELECT * FROM Personen', (err, results) => { // Änderung des Tabellennamens hier
    if (err) {
      console.error('Fehler beim Abrufen der Daten:', err);
      res.status(500).send('Interner Serverfehler');
      return;
    }
    // Daten auf der Webseite anzeigen
    let html = `<h1>Personen</h1>`;
    if (results.length > 0) {
      html += `<ul>`;
      results.forEach(result => {
        if (result.Name && result.Geburtsjahr) {
          html += `<li>${result.Name}, geboren ${result.Geburtsjahr}</li>`;
        }
      });
      html += `</ul>`;
    } else {
      html += `<p>Keine Daten gefunden</p>`;
    }
    html += `
      <form action="/addPerson" method="post" onsubmit="return validateForm()">
        <input type="text" name="Name" id="name" placeholder="Name">
        <input type="number" name="Geburtsjahr" id="geburtsjahr" placeholder="Geburtsjahr">
        <button type="submit">Person hinzufügen</button>
      </form>
      <script>
        function validateForm() {
          const name = document.getElementById('name').value;
          const geburtsjahr = document.getElementById('geburtsjahr').value;
          if (name.trim() === '' || geburtsjahr.trim() === '') {
            alert('Bitte füllen Sie alle Felder aus');
            return false;
          }
          return true;
        }
      </script>
    `;
    res.send(html);
  });
});

// POST-Route zum Hinzufügen einer Person
app.post('/addPerson', (req, res) => {
  const { Name, Geburtsjahr } = req.body;
  connection.query('INSERT INTO Personen (Name, Geburtsjahr) VALUES (?, ?)', [Name, Geburtsjahr], (err, result) => { // Änderung des Tabellennamens hier
    if (err) {
      console.error('Fehler beim Hinzufügen der Person:', err);
      res.status(500).send('Interner Serverfehler');
      return;
    }
    console.log('Person erfolgreich hinzugefügt');
    res.redirect('/');
  });
});

// Server starten
const port = 3000;
app.listen(port, () => {
  console.log(`Server läuft auf localhost:${port}`);
});
