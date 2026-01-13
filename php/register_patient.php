<?php

declare(strict_types=1);

require __DIR__ . '/db.php';

$errors = [];
$successId = null;
$successBmi = null;
$successBmiCategory = null;
$successProceduresTotal = null;

$values = [
    'full_name' => '',
  'remitente' => '',
    'age' => '',
    'biological_sex' => 'Female',
    'weight_kg' => '',
    'height_m' => '',
    'treatment_area' => '',
  'contraindications_text' => '',
    'diabetes' => '0',
    'hypertension' => '0',
    'pregnancy' => '0',
    'lactation' => '0',
    'implanted_device' => '0',
    'notes' => '',
];

// Procedures list must match the frontend options (ids are stored; labels are for display).
$PROCEDURES = [
  ['id' => 'abdomen_completo', 'label' => 'Abdomen completo'],
  ['id' => 'laterales', 'label' => 'Laterales'],
  ['id' => 'cintura', 'label' => 'Cintura'],
  ['id' => 'espalda_completa', 'label' => 'Espalda completa'],
  ['id' => 'coxis', 'label' => 'Coxis'],
  ['id' => 'brazos', 'label' => 'Brazos'],
  ['id' => 'papada', 'label' => 'Papada'],
  ['id' => 'pierna', 'label' => 'Pierna'],
  ['id' => 'criolipolisis', 'label' => 'Criolipólisis'],
  ['id' => 'radiofrecuencia', 'label' => 'Radiofrecuencia'],
  ['id' => 'cavitacion', 'label' => 'Cavitación'],
  ['id' => 'hifu', 'label' => 'HIFU'],
  ['id' => 'laser_basico', 'label' => 'Láser básico'],
  ['id' => 'laser_infrarrojo', 'label' => 'Láser infrarrojo'],
  ['id' => 'laser', 'label' => 'Láser'],
  ['id' => 'laser_diodo', 'label' => 'Láser diodo'],
  ['id' => 'lipoinyeccion', 'label' => 'Lipoinyección'],
  ['id' => 'faja_postoperatoria', 'label' => 'Faja postoperatoria'],
  ['id' => 'medicamentos', 'label' => 'Medicamentos'],
  ['id' => 'drenaje', 'label' => 'Drenaje linfático'],
  ['id' => 'masaje', 'label' => 'Masaje postoperatorio'],
  ['id' => 'espuma_reafirmante', 'label' => 'Espuma reafirmante'],
  ['id' => 'examenes', 'label' => 'Exámenes'],
  ['id' => 'controles', 'label' => 'Controles'],
];

$procedureSelected = [];
$procedurePrices = [];
$procedureMeta = [];

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
  if ($bmi < 16.0) {
    return 'Delgadez severa (< 16.0)';
  }
  if ($bmi < 17.0) {
    return 'Delgadez moderada (16.0–16.9)';
  }
  if ($bmi < 18.5) {
    return 'Delgadez leve (17.0–18.4)';
  }
  if ($bmi < 25.0) {
    return 'Peso normal (18.5–24.9)';
  }
  if ($bmi < 30.0) {
    return 'Sobrepeso (25.0–29.9)';
  }
  if ($bmi < 35.0) {
    return 'Obesidad grado I (30.0–34.9)';
  }
  if ($bmi < 40.0) {
    return 'Obesidad grado II (35.0–39.9)';
  }
  return 'Obesidad grado III (≥ 40)';
}

function normalizeForSearch(string $text): string
{
  $t = mb_strtolower($text, 'UTF-8');
  // Basic accent folding for Spanish.
  $t = strtr($t, [
    'á' => 'a', 'à' => 'a', 'ä' => 'a', 'â' => 'a',
    'é' => 'e', 'è' => 'e', 'ë' => 'e', 'ê' => 'e',
    'í' => 'i', 'ì' => 'i', 'ï' => 'i', 'î' => 'i',
    'ó' => 'o', 'ò' => 'o', 'ö' => 'o', 'ô' => 'o',
    'ú' => 'u', 'ù' => 'u', 'ü' => 'u', 'û' => 'u',
    'ñ' => 'n',
  ]);
  return $t;
}

function isNegatedNear(string $normalized, int $matchOffset): bool
{
  if ($matchOffset <= 0) {
    return false;
  }
  $start = max(0, $matchOffset - 40);
  $window = substr($normalized, $start, $matchOffset - $start);
  // Consider it negated if a negation token appears shortly before the match.
  return (bool)preg_match('/\b(no|niega|neg(?:a|o)|sin|descarta|ningun(?:a)?)\b[^\n]{0,20}$/', $window);
}

function computeEligibilityFromText(string $contraText, array $bools = []): int
{
  // Backward compatible: if any explicit checkbox contraindication is present, not eligible.
  foreach ($bools as $v) {
    if ((int)$v === 1) {
      return 0;
    }
  }

  $t = trim($contraText);
  if ($t === '') {
    // Default to eligible unless we detect a contraindication.
    return 1;
  }

  $n = normalizeForSearch($t);

  // Simple heuristic keyword checks.
  $patterns = [
    '/\bembaraz\w*\b/u',
    '/\bgestant\w*\b/u',
    '/\blactan\w*\b/u',
    '/\bdiabet\w*\b/u',
    '/\bhipertens\w*\b/u',
    '/\bhta\b/u',
    '/\bmarcapasos\b/u',
    '/\bimplant\w*\b/u',
    '/\bdispositivo\s+implant\w*\b/u',
  ];

  foreach ($patterns as $re) {
    if (preg_match_all($re, $n, $m, PREG_OFFSET_CAPTURE)) {
      foreach ($m[0] as $hit) {
        $offset = (int)($hit[1] ?? 0);
        if (!isNegatedNear($n, $offset)) {
          return 0;
        }
      }
    }
  }

  return 1;
}

function parseMoney(string $value): ?float
{
  $v = trim($value);
  if ($v === '') {
    return null;
  }

  // Keep only digits, separators and sign (allow inputs like "$ 1.500.000" or "1.500.000" or "1500000").
  $v = preg_replace('/[^0-9,\.\-]/', '', $v);
  if ($v === null || $v === '') {
    return null;
  }

  $dotCount = substr_count($v, '.');
  $commaCount = substr_count($v, ',');

  // If both are present: assume thousands '.' and decimal ',' (es-CO style)
  if ($dotCount > 0 && $commaCount > 0) {
    $v = str_replace('.', '', $v);
    $v = str_replace(',', '.', $v);
  } elseif ($dotCount > 1 && $commaCount === 0) {
    // Many dots: treat as thousands separators
    $v = str_replace('.', '', $v);
  } elseif ($commaCount > 1 && $dotCount === 0) {
    // Many commas: treat as thousands separators
    $v = str_replace(',', '', $v);
  } elseif ($dotCount === 1 && $commaCount === 0) {
    // One dot: decide decimal vs thousands by digits after separator
    $parts = explode('.', $v);
    if (count($parts) === 2 && strlen($parts[1]) === 3 && strlen($parts[0]) >= 1) {
      $v = $parts[0] . $parts[1];
    }
  } elseif ($commaCount === 1 && $dotCount === 0) {
    $parts = explode(',', $v);
    if (count($parts) === 2 && strlen($parts[1]) === 3 && strlen($parts[0]) >= 1) {
      $v = $parts[0] . $parts[1];
    } else {
      $v = str_replace(',', '.', $v);
    }
  }

  $n = filter_var($v, FILTER_VALIDATE_FLOAT);
  if ($n === false) {
    return null;
  }
  $n = (float)$n;
  if (!is_finite($n)) {
    return null;
  }
  return $n;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    foreach (array_keys($values) as $k) {
        if (isset($_POST[$k])) {
            $values[$k] = is_string($_POST[$k]) ? trim($_POST[$k]) : $values[$k];
        }
    }

  // Procedures (optional)
  $procedureSelected = [];
  $procedurePrices = [];
  $selectedIds = [];
  if (isset($_POST['procedures'])) {
    $selectedIds = is_array($_POST['procedures']) ? $_POST['procedures'] : [$_POST['procedures']];
  }
  foreach ($selectedIds as $rawId) {
    if (!is_string($rawId)) {
      continue;
    }
    $id = trim($rawId);
    if ($id === '' || !preg_match('/^[a-z0-9_-]{1,64}$/', $id)) {
      continue;
    }
    $procedureSelected[$id] = true;
  }
  if (isset($_POST['procedure_price']) && is_array($_POST['procedure_price'])) {
    foreach ($_POST['procedure_price'] as $k => $v) {
      if (!is_string($k) || !is_string($v)) {
        continue;
      }
      $procedurePrices[trim($k)] = trim($v);
    }
  }

  // procedure_meta can be a nested array: procedure_meta[procedure_id][key]=value
  $procedureMeta = [];
  if (isset($_POST['procedure_meta']) && is_array($_POST['procedure_meta'])) {
    foreach ($_POST['procedure_meta'] as $procId => $meta) {
      if (!is_string($procId) || !is_array($meta)) {
        continue;
      }
      $procId = trim($procId);
      if ($procId === '' || !preg_match('/^[a-z0-9_-]{1,64}$/', $procId)) {
        continue;
      }
      foreach ($meta as $k => $v) {
        if (!is_string($k)) {
          continue;
        }
        if (is_string($v)) {
          $procedureMeta[$procId][trim($k)] = trim($v);
        }
      }
    }
  }

    $fullName = $values['full_name'];
    $remitenteRaw = $values['remitente'];
    $age = filter_var($values['age'], FILTER_VALIDATE_INT);
    $sex = $values['biological_sex'];
    $weightKg = filter_var($values['weight_kg'], FILTER_VALIDATE_FLOAT);
    $heightM = filter_var($values['height_m'], FILTER_VALIDATE_FLOAT);
    $treatmentArea = $values['treatment_area'];
    $contraTextRaw = $values['contraindications_text'];

    $diabetes = toBool($values['diabetes']);
    $hypertension = toBool($values['hypertension']);
    $pregnancy = toBool($values['pregnancy']);
    $lactation = toBool($values['lactation']);
    $implantedDevice = toBool($values['implanted_device']);
    $notes = $values['notes'] !== '' ? $values['notes'] : null;
    $remitente = $remitenteRaw !== '' ? $remitenteRaw : null;
    $contraText = $contraTextRaw !== '' ? $contraTextRaw : null;

    if ($fullName === '') {
      $errors[] = 'El nombre completo es obligatorio.';
    }
    if ($remitente !== null && mb_strlen($remitente) > 255) {
      $errors[] = 'El remitente es demasiado largo.';
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
    if ($contraText !== null && mb_strlen($contraText) > 5000) {
      $errors[] = 'El texto de antecedentes / contraindicaciones es demasiado largo.';
    }

    // Validate procedures: only allow prices for checked items; checked items must have a valid price.
    $procedureRows = [];
    $proceduresTotal = 0.0;
    if ($procedureSelected) {
      $procedureLabelMap = [];
      foreach ($PROCEDURES as $p) {
        $procedureLabelMap[$p['id']] = $p['label'];
      }

      foreach (array_keys($procedureSelected) as $procedureId) {
        if (!isset($procedureLabelMap[$procedureId])) {
          $errors[] = 'Procedimiento inválido: ' . $procedureId;
          continue;
        }

        $detailsObj = [];
        $freeDetails = isset($procedureMeta[$procedureId]['details'])
          ? trim((string)$procedureMeta[$procedureId]['details'])
          : '';
        if ($freeDetails !== '') {
          if (mb_strlen($freeDetails) > 2000) {
            $errors[] = 'Los detalles son demasiado largos para el procedimiento: ' . ($procedureLabelMap[$procedureId] ?? $procedureId);
            continue;
          }
          $detailsObj['details'] = $freeDetails;
        }

        if ($procedureId === 'pierna') {
          $interna = isset($procedureMeta['pierna']['interna']) ? toBool((string)$procedureMeta['pierna']['interna']) : 0;
          $externa = isset($procedureMeta['pierna']['externa']) ? toBool((string)$procedureMeta['pierna']['externa']) : 0;
          if ($interna !== 1 && $externa !== 1) {
            $errors[] = 'En Pierna debes seleccionar Interna y/o Externa.';
            continue;
          }
          $detailsObj['interna'] = (bool)$interna;
          $detailsObj['externa'] = (bool)$externa;
        }

        if ($procedureId === 'faja_postoperatoria') {
          $talla = isset($procedureMeta['faja_postoperatoria']['talla']) ? trim((string)$procedureMeta['faja_postoperatoria']['talla']) : '';
          if ($talla === '') {
            $errors[] = 'La talla es obligatoria para Faja postoperatoria.';
            continue;
          }
          if (mb_strlen($talla) > 50) {
            $errors[] = 'La talla de Faja postoperatoria es demasiado larga.';
            continue;
          }
          $detailsObj['talla'] = $talla;
        }

        $details = null;
        if (!empty($detailsObj)) {
          $encoded = json_encode($detailsObj, JSON_UNESCAPED_UNICODE);
          if ($encoded === false) {
            $errors[] = 'Error serializando detalles del procedimiento: ' . ($procedureLabelMap[$procedureId] ?? $procedureId);
            continue;
          }
          $details = $encoded;
        }

        $rawPrice = $procedurePrices[$procedureId] ?? '';
        $price = parseMoney($rawPrice);
        if ($price === null) {
          $label = $procedureLabelMap[$procedureId] ?? $procedureId;
          $errors[] = 'El precio es obligatorio para el procedimiento: ' . $label;
          continue;
        }
        if ($price < 0) {
          $label = $procedureLabelMap[$procedureId] ?? $procedureId;
          $errors[] = 'El precio no puede ser negativo para el procedimiento: ' . $label;
          continue;
        }

        $procedureRows[] = [
          'procedure_id' => $procedureId,
          'procedure_label' => $procedureLabelMap[$procedureId] ?? null,
          'price' => round($price, 2),
          'details_json' => $details,
        ];

        $proceduresTotal += round($price, 2);
      }
    }

    if (!$errors) {
        $bmi = round(computeBmi((float)$weightKg, (float)$heightM), 2);
      $bmiCat = bmiCategory((float)$bmi);
        $eligible = computeEligibilityFromText((string)($contraText ?? ''), [
          $diabetes,
          $hypertension,
          $pregnancy,
          $lactation,
          $implantedDevice,
        ]);

        try {
          db()->beginTransaction();

          $stmt = db()->prepare(
            'INSERT INTO patients (
              full_name, remitente, age, biological_sex, weight_kg, height_m, bmi, treatment_area,
              contraindications_text,
              diabetes, hypertension, pregnancy, lactation, implanted_device,
              eligible, notes, procedures_total
            ) VALUES (
              :full_name, :remitente, :age, :biological_sex, :weight_kg, :height_m, :bmi, :treatment_area,
              :contraindications_text,
              :diabetes, :hypertension, :pregnancy, :lactation, :implanted_device,
              :eligible, :notes, :procedures_total
            )'
          );

          $stmt->execute([
            ':full_name' => $fullName,
            ':remitente' => $remitente,
            ':age' => (int)$age,
            ':biological_sex' => $sex,
            ':weight_kg' => (float)$weightKg,
            ':height_m' => (float)$heightM,
            ':bmi' => (float)$bmi,
            ':treatment_area' => $treatmentArea,
            ':contraindications_text' => $contraText,
            ':diabetes' => $diabetes,
            ':hypertension' => $hypertension,
            ':pregnancy' => $pregnancy,
            ':lactation' => $lactation,
            ':implanted_device' => $implantedDevice,
            ':eligible' => $eligible,
            ':notes' => $notes,
            ':procedures_total' => round($proceduresTotal, 2),
          ]);

          $successId = (int)db()->lastInsertId();

          if ($procedureRows) {
            $stmtProc = db()->prepare(
              'INSERT INTO patient_procedures (patient_id, procedure_id, procedure_label, price, details_json)
               VALUES (:patient_id, :procedure_id, :procedure_label, :price, :details_json)'
            );
            foreach ($procedureRows as $row) {
              $stmtProc->execute([
                ':patient_id' => $successId,
                ':procedure_id' => $row['procedure_id'],
                ':procedure_label' => $row['procedure_label'],
                ':price' => $row['price'],
                ':details_json' => $row['details_json'],
              ]);
            }
          }

          db()->commit();

          $successBmi = (float)$bmi;
          $successBmiCategory = $bmiCat;
          $successProceduresTotal = round($proceduresTotal, 2);
        } catch (Throwable $e) {
          if (db()->inTransaction()) {
            db()->rollBack();
          }
          $errors[] = 'Error guardando en base de datos: ' . $e->getMessage();
        }

        if (!$errors) {
          // Reset form on success
          foreach ($values as $k => $_) {
            $values[$k] = ($k === 'biological_sex') ? 'Female' : (($k === 'diabetes' || $k === 'hypertension' || $k === 'pregnancy' || $k === 'lactation' || $k === 'implanted_device') ? '0' : '');
          }
          $procedureSelected = [];
          $procedurePrices = [];
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
        <?php if ($successProceduresTotal !== null): ?>
          <div class="hint" style="margin-top:6px">
            Total procedimientos: <span class="kpi"><?= h('$ ' . number_format((float)$successProceduresTotal, 0, ',', '.')) ?></span>
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
            <label for="remitente">Remitente (opcional)</label>
            <input id="remitente" name="remitente" maxlength="255" value="<?= h($values['remitente']) ?>" placeholder="Ej. Dr. Juan / Instagram / Referido" />
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
                $pdetails = $procedureMeta[$pid]['details'] ?? '';
                $piernaInternaChecked = isset($procedureMeta['pierna']['interna']) ? toBool((string)$procedureMeta['pierna']['interna']) : 0;
                $piernaExternaChecked = isset($procedureMeta['pierna']['externa']) ? toBool((string)$procedureMeta['pierna']['externa']) : 0;
                $fajaTallaVal = $procedureMeta['faja_postoperatoria']['talla'] ?? '';
            <div id="bmi_status" class="hint">El IMC se calcula en el servidor y se guarda como `bmi`.</div>
          </div>
        </div>

        <div class="field">
          <label for="treatment_area">Área de tratamiento</label>
          <input id="treatment_area" name="treatment_area" value="<?= h($values['treatment_area']) ?>" required />
        </div>

        <div class="field">
          <label>Procedimientos</label>
          <div class="hint">Marca los procedimientos realizados e ingresa el precio solo en los marcados.</div>
                  <div class="field" style="min-width:220px; margin:0;">
                    <label for="procedure_price_<?= h($pid) ?>" style="margin:0 0 6px;">Precio</label>
                    <input
                      id="procedure_price_<?= h($pid) ?>"
                      name="procedure_price[<?= h($pid) ?>]"
                      inputmode="decimal"
                      value="<?= h($pval) ?>"
                      <?= $checked ? '' : 'disabled' ?>
                      <?= $checked ? 'required' : '' ?>
                      data-proc-price
                    />

                    <?php if ($pid === 'pierna'): ?>
                      <div class="hint" style="margin-top:8px;">Pierna: selecciona Interna y/o Externa</div>
                      <div class="check" style="margin-top:6px;">
                        <input type="checkbox" name="procedure_meta[pierna][interna]" value="1" <?= $piernaInternaChecked ? 'checked' : '' ?> <?= $checked ? '' : 'disabled' ?> data-proc-meta />
                        <span>Interna</span>
                      </div>
                      <div class="check" style="margin-top:6px;">
                        <input type="checkbox" name="procedure_meta[pierna][externa]" value="1" <?= $piernaExternaChecked ? 'checked' : '' ?> <?= $checked ? '' : 'disabled' ?> data-proc-meta />
                        <span>Externa</span>
                      </div>
                    <?php endif; ?>

                    <?php if ($pid === 'faja_postoperatoria'): ?>
                      <label for="procedure_talla_<?= h($pid) ?>" style="margin:10px 0 6px;">Talla</label>
                      <input
                        id="procedure_talla_<?= h($pid) ?>"
                        name="procedure_meta[faja_postoperatoria][talla]"
                        value="<?= h((string)$fajaTallaVal) ?>"
                        <?= $checked ? '' : 'disabled' ?>
                        <?= $checked ? 'required' : '' ?>
                        data-proc-meta
                      />
                    <?php endif; ?>

                    <label for="procedure_details_<?= h($pid) ?>" style="margin:10px 0 6px;">Detalles (opcional)</label>
                    <textarea
                      id="procedure_details_<?= h($pid) ?>"
                      name="procedure_meta[<?= h($pid) ?>][details]"
                      maxlength="2000"
                      <?= $checked ? '' : 'disabled' ?>
                      data-proc-meta
                    ><?= h((string)$pdetails) ?></textarea>

                    <input type="hidden" name="procedure_label[<?= h($pid) ?>]" value="<?= h((string)$p['label']) ?>" />
                  </div>
                    data-proc-check
                  />
                  <?= h((string)$p['label']) ?>
                </label>

          <div class="field">
            <label for="contraindications_text">Antecedentes / contraindicaciones (texto libre)</label>
            <textarea id="contraindications_text" name="contraindications_text" maxlength="5000" placeholder="Ej. Niega embarazo y lactancia. HTA controlada. Sin marcapasos..."><?= h($values['contraindications_text']) ?></textarea>
            <div class="hint">El backend usa una heurística del texto para calcular elegibilidad.</div>
          </div>
                    <?= $checked ? 'required' : '' ?>
                    data-proc-price
                  />
                  <input type="hidden" name="procedure_label[<?= h($pid) ?>]" value="<?= h((string)$p['label']) ?>" />
                </div>
              </div>
            <?php endforeach; ?>
          </div>
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
          if (bmi < 16.0) cat = 'Delgadez severa (< 16.0)';
          else if (bmi < 17.0) cat = 'Delgadez moderada (16.0–16.9)';
          else if (bmi < 18.5) cat = 'Delgadez leve (17.0–18.4)';
          else if (bmi < 25.0) cat = 'Peso normal (18.5–24.9)';
          else if (bmi < 30.0) cat = 'Sobrepeso (25.0–29.9)';
          else if (bmi < 35.0) cat = 'Obesidad grado I (30.0–34.9)';
          else if (bmi < 40.0) cat = 'Obesidad grado II (35.0–39.9)';
          else cat = 'Obesidad grado III (≥ 40)';
          status.textContent = cat + ' — solo vista previa';
        }
      }

      w.addEventListener('input', update);
      h.addEventListener('input', update);
      update();
    })();

    (function () {
      var checks = document.querySelectorAll('[data-proc-check]');

      function syncRow(check) {
        var row = check.closest('.row');
        if (!row) return;
        var price = row.querySelector('[data-proc-price]');
        if (!price) return;
        price.disabled = !check.checked;
        price.required = !!check.checked;
        if (!check.checked) price.value = '';

        var meta = row.querySelectorAll('[data-proc-meta]');
        meta.forEach(function (el) {
          el.disabled = !check.checked;
          if (!check.checked) {
            if (el.tagName === 'INPUT' && (el.type === 'checkbox' || el.type === 'radio')) {
              el.checked = false;
            } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
              el.value = '';
            }
          }
        });
      }

      checks.forEach(function (c) {
        syncRow(c);
        c.addEventListener('change', function () { syncRow(c); });
      });
    })();
  </script>
</body>
</html>
