<?php

declare(strict_types=1);

require __DIR__ . '/db.php';

$errors = [];
$successId = null;
$successBmi = null;
$successBmiCategory = null;

$values = [
    'full_name' => '',
    'age' => '',
    'biological_sex' => 'Female',
    'weight_kg' => '',
    'height_m' => '',
    'treatment_area' => '',
    'diabetes' => '0',
    'hypertension' => '0',
    'pregnancy' => '0',
    'lactation' => '0',
    'implanted_device' => '0',
    'notes' => '',
];

function toBool(string $v): int
{
    return ($v === '1' || $v === 'on') ? 1 : 0;
}

function computeBmi(float $weightKg, float $heightM): float
{
    if ($heightM <= 0) {
        return 0.0;
    }
    return $weightKg / ($heightM * $heightM);
}

function bmiCategory(float $bmi): string
{
  if ($bmi < 18.5) {
    return 'Bajo peso (< 18.5)';
  }
  if ($bmi < 25.0) {
    return 'Peso normal (18.5–24.9)';
  }
  if ($bmi < 30.0) {
    return 'Sobrepeso (25–29.9)';
  }
  return 'Obesidad (≥ 30)';
}

function computeEligibility(array $bools): int
{
    // Minimal, conservative rule: eligible unless any contraindication is checked.
    foreach ($bools as $v) {
        if ((int)$v === 1) {
            return 0;
        }
    }
    return 1;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    foreach (array_keys($values) as $k) {
        if (isset($_POST[$k])) {
            $values[$k] = is_string($_POST[$k]) ? trim($_POST[$k]) : $values[$k];
        }
    }

    $fullName = $values['full_name'];
    $age = filter_var($values['age'], FILTER_VALIDATE_INT);
    $sex = $values['biological_sex'];
    $weightKg = filter_var($values['weight_kg'], FILTER_VALIDATE_FLOAT);
    $heightM = filter_var($values['height_m'], FILTER_VALIDATE_FLOAT);
    $treatmentArea = $values['treatment_area'];

    $diabetes = toBool($values['diabetes']);
    $hypertension = toBool($values['hypertension']);
    $pregnancy = toBool($values['pregnancy']);
    $lactation = toBool($values['lactation']);
    $implantedDevice = toBool($values['implanted_device']);
    $notes = $values['notes'] !== '' ? $values['notes'] : null;

    if ($fullName === '') {
      $errors[] = 'El nombre completo es obligatorio.';
    }
    if ($age === false || $age < 0 || $age > 150) {
      $errors[] = 'La edad debe ser un número válido.';
    }
    if (!in_array($sex, ['Female', 'Male', 'Other'], true)) {
      $errors[] = 'El sexo biológico debe ser Female, Male u Other.';
    }
    if ($weightKg === false || $weightKg <= 0) {
      $errors[] = 'El peso (kg) debe ser un número válido.';
    }
    if ($heightM === false || $heightM <= 0) {
      $errors[] = 'La estatura (m) debe ser un número válido.';
    }
    if ($treatmentArea === '') {
      $errors[] = 'El área de tratamiento es obligatoria.';
    }

    if (!$errors) {
        $bmi = round(computeBmi((float)$weightKg, (float)$heightM), 2);
      $bmiCat = bmiCategory((float)$bmi);
        $eligible = computeEligibility([
            $diabetes,
            $hypertension,
            $pregnancy,
            $lactation,
            $implantedDevice,
        ]);

        $stmt = db()->prepare(
            'INSERT INTO patients (
                full_name, age, biological_sex, weight_kg, height_m, bmi, treatment_area,
                diabetes, hypertension, pregnancy, lactation, implanted_device,
                eligible, notes
            ) VALUES (
                :full_name, :age, :biological_sex, :weight_kg, :height_m, :bmi, :treatment_area,
                :diabetes, :hypertension, :pregnancy, :lactation, :implanted_device,
                :eligible, :notes
            )'
        );

        $stmt->execute([
            ':full_name' => $fullName,
            ':age' => (int)$age,
            ':biological_sex' => $sex,
            ':weight_kg' => (float)$weightKg,
            ':height_m' => (float)$heightM,
            ':bmi' => (float)$bmi,
            ':treatment_area' => $treatmentArea,
            ':diabetes' => $diabetes,
            ':hypertension' => $hypertension,
            ':pregnancy' => $pregnancy,
            ':lactation' => $lactation,
            ':implanted_device' => $implantedDevice,
            ':eligible' => $eligible,
            ':notes' => $notes,
        ]);

        $successId = (int)db()->lastInsertId();
        $successBmi = (float)$bmi;
        $successBmiCategory = $bmiCat;

        // Reset form on success
        foreach ($values as $k => $_) {
            $values[$k] = ($k === 'biological_sex') ? 'Female' : (($k === 'diabetes' || $k === 'hypertension' || $k === 'pregnancy' || $k === 'lactation' || $k === 'implanted_device') ? '0' : '');
        }
    }
}

?><!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Registro de Paciente</title>
  <style>
    body{font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin:24px; color:#111;}
    .wrap{max-width:860px; margin:0 auto;}
    .card{border:1px solid #e5e7eb; border-radius:12px; padding:18px;}
    .row{display:flex; gap:12px; flex-wrap:wrap;}
    .field{flex:1; min-width:220px; margin-bottom:12px;}
    label{display:block; font-size:13px; margin-bottom:6px; color:#374151;}
    input, select, textarea{width:100%; padding:10px 12px; border:1px solid #d1d5db; border-radius:10px; font-size:14px;}
    textarea{min-height:110px; resize:vertical;}
    .checks{display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:10px; margin:10px 0 14px;}
    .check{display:flex; align-items:center; gap:8px;}
    .check input{width:auto;}
    .actions{display:flex; gap:10px; align-items:center;}
    button{background:#0ea5e9; color:white; border:none; padding:10px 14px; border-radius:10px; cursor:pointer; font-weight:600;}
    button:hover{opacity:.95}
    .hint{font-size:12px; color:#6b7280; margin-top:6px;}
    .err{background:#fef2f2; border:1px solid #fecaca; color:#991b1b; padding:10px 12px; border-radius:10px; margin-bottom:12px;}
    .ok{background:#ecfdf5; border:1px solid #a7f3d0; color:#065f46; padding:10px 12px; border-radius:10px; margin-bottom:12px;}
    .kpi{font-weight:700}
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Registro de paciente</h1>

    <?php if ($successId !== null): ?>
      <div class="ok">
        Paciente guardado. Nuevo ID: <span class="kpi"><?= h((string)$successId) ?></span>
        <?php if ($successBmi !== null && $successBmiCategory !== null): ?>
          <div class="hint" style="margin-top:6px">
            IMC: <span class="kpi"><?= h(number_format($successBmi, 2)) ?></span>
            — <?= h($successBmiCategory) ?>
          </div>
        <?php endif; ?>
      </div>
    <?php endif; ?>

    <?php if ($errors): ?>
      <div class="err">
        <strong>Por favor corrige:</strong>
        <ul>
          <?php foreach ($errors as $e): ?>
            <li><?= h($e) ?></li>
          <?php endforeach; ?>
        </ul>
      </div>
    <?php endif; ?>

    <div class="card">
      <form method="post" action="">
        <div class="row">
          <div class="field">
            <label for="full_name">Nombre completo</label>
            <input id="full_name" name="full_name" value="<?= h($values['full_name']) ?>" required />
          </div>
          <div class="field">
            <label for="age">Edad</label>
            <input id="age" name="age" type="number" min="0" max="150" value="<?= h($values['age']) ?>" required />
          </div>
          <div class="field">
            <label for="biological_sex">Sexo biológico</label>
            <select id="biological_sex" name="biological_sex" required>
              <?php foreach (['Female','Male','Other'] as $opt): ?>
                <option value="<?= h($opt) ?>" <?= $values['biological_sex'] === $opt ? 'selected' : '' ?>><?= h($opt) ?></option>
              <?php endforeach; ?>
            </select>
          </div>
        </div>

        <div class="row">
          <div class="field">
            <label for="weight_kg">Peso (kg)</label>
            <input id="weight_kg" name="weight_kg" inputmode="decimal" value="<?= h($values['weight_kg']) ?>" required />
          </div>
          <div class="field">
            <label for="height_m">Estatura (m)</label>
            <input id="height_m" name="height_m" inputmode="decimal" value="<?= h($values['height_m']) ?>" required />
          </div>
          <div class="field">
            <label for="bmi_preview">IMC (auto)</label>
            <input id="bmi_preview" value="" disabled />
            <div id="bmi_status" class="hint">El IMC se calcula en el servidor y se guarda como `bmi`.</div>
          </div>
        </div>

        <div class="field">
          <label for="treatment_area">Área de tratamiento</label>
          <input id="treatment_area" name="treatment_area" value="<?= h($values['treatment_area']) ?>" required />
        </div>

        <div class="checks">
          <label class="check"><input type="checkbox" name="diabetes" value="1" <?= toBool($values['diabetes']) ? 'checked' : '' ?> /> Diabetes</label>
          <label class="check"><input type="checkbox" name="hypertension" value="1" <?= toBool($values['hypertension']) ? 'checked' : '' ?> /> Hipertensión</label>
          <label class="check"><input type="checkbox" name="pregnancy" value="1" <?= toBool($values['pregnancy']) ? 'checked' : '' ?> /> Embarazo</label>
          <label class="check"><input type="checkbox" name="lactation" value="1" <?= toBool($values['lactation']) ? 'checked' : '' ?> /> Lactancia</label>
          <label class="check"><input type="checkbox" name="implanted_device" value="1" <?= toBool($values['implanted_device']) ? 'checked' : '' ?> /> Dispositivo implantado</label>
        </div>

        <div class="field">
          <label for="notes">Notas</label>
          <textarea id="notes" name="notes"><?= h($values['notes']) ?></textarea>
        </div>

        <div class="actions">
          <button type="submit">Guardar paciente</button>
          <span class="hint">La elegibilidad se calcula al guardar.</span>
        </div>
      </form>
    </div>
  </div>

  <script>
    (function () {
      var w = document.getElementById('weight_kg');
      var h = document.getElementById('height_m');
      var out = document.getElementById('bmi_preview');
      var status = document.getElementById('bmi_status');

      function parseNum(v) {
        if (!v) return NaN;
        // Accept comma or dot
        v = String(v).replace(',', '.');
        return Number(v);
      }

      function update() {
        var weight = parseNum(w.value);
        var height = parseNum(h.value);
        if (!isFinite(weight) || !isFinite(height) || height <= 0) {
          out.value = '';
          if (status) status.textContent = 'El IMC se calcula en el servidor y se guarda como `bmi`.';
          return;
        }
        var bmi = weight / (height * height);
        out.value = bmi.toFixed(2);
        if (status) {
          var cat = '';
          if (bmi < 18.5) cat = 'Bajo peso (< 18.5)';
          else if (bmi < 25) cat = 'Peso normal (18.5–24.9)';
          else if (bmi < 30) cat = 'Sobrepeso (25–29.9)';
          else cat = 'Obesidad (≥ 30)';
          status.textContent = cat + ' — solo vista previa';
        }
      }

      w.addEventListener('input', update);
      h.addEventListener('input', update);
      update();
    })();
  </script>
</body>
</html>
