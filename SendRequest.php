<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

// --- ФУНКЦИЯ ЛОГИРОВАНИЯ ---
function writeLog($message, $level = 'INFO') {
    $logFile = __DIR__ . '/send_request.log';
    $date = date('Y-m-d H:i:s');
    $logMessage = "[{$date}] [{$level}] {$message}\n";
    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

writeLog("=== Новый запрос ===");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    writeLog("Ошибка: недопустимый метод запроса {$_SERVER['REQUEST_METHOD']}", 'ERROR');
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Доступ запрещен"]);
    exit;
}

// --- КОНФИГУРАЦИЯ ---
$config = [
    'telegram' => [
        'bot_token' => "8826695365:AAHxRjPlzW3S3m87Yi2A4tanqps8dxudbQY",
        'chat_ids' => [
            74730041,
        ],
    ],
    // Выберите способ отправки: 'mail' для PHP mail() или 'smtp' для PHPMailer
    'mail_method' => 'mail', // или 'smtp'
    
    // Настройки для PHP mail() (пароль не нужен)
    'timeweb_mail' => [
        'from_email' => 'noreply@ci880145.tw1.ru', // отправитель
        'from_name' => 'Сайт Movly',
        'admin_emails' => [
            'e.p.ushakov@gmail.com', // кому отправлять заявки
        ],
    ],
    
    // Настройки для SMTP (если mail() не заработает)
    'timeweb_smtp' => [
        'host' => 'smtp.timeweb.ru',
        'port' => 587,
        'username' => 'noreply@ci880145.tw1.ru',
        'password' => 'GOmail123', // тут нужно ввести пароль от почты
        'from_email' => 'noreply@ci880145.tw1.ru',
        'from_name' => 'Сайт Movly',
        'admin_emails' => [
            'e.p.ushakov@gmail.com',
        ],
    ],
];

writeLog("Конфигурация загружена");

// Получаем данные (поддерживаем как JSON, так и form-data)
$input = file_get_contents('php://input');
writeLog("Входные данные: " . $input);
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    $data = $_POST;
    writeLog("Используем данные из POST");
}

// Получаем точные поля из данных
$name     = isset($data['name']) ? trim(htmlspecialchars($data['name'])) : '';
$telegram = isset($data['telegram']) ? trim(htmlspecialchars($data['telegram'])) : '';
$phone    = isset($data['phone']) ? trim(htmlspecialchars($data['phone'])) : '';
$contactType = isset($data['contactType']) ? $data['contactType'] : '';

// Yandex Metrika tracking metadata
$client_id = isset($data['client_id']) ? trim(htmlspecialchars($data['client_id'])) : '';
$utm_source = isset($data['utm_source']) ? trim(htmlspecialchars($data['utm_source'])) : '';
$utm_medium = isset($data['utm_medium']) ? trim(htmlspecialchars($data['utm_medium'])) : '';
$utm_campaign = isset($data['utm_campaign']) ? trim(htmlspecialchars($data['utm_campaign'])) : '';
$utm_content = isset($data['utm_content']) ? trim(htmlspecialchars($data['utm_content'])) : '';
$utm_term = isset($data['utm_term']) ? trim(htmlspecialchars($data['utm_term'])) : '';
$landing_page = isset($data['landing_page']) ? trim(htmlspecialchars($data['landing_page'])) : '';
$referrer = isset($data['referrer']) ? trim(htmlspecialchars($data['referrer'])) : '';
$direction = isset($data['direction']) ? trim(htmlspecialchars($data['direction'])) : '';
$timestamp = isset($data['timestamp']) ? trim(htmlspecialchars($data['timestamp'])) : '';
$user_agent = isset($data['user_agent']) ? trim(htmlspecialchars($data['user_agent'])) : '';
$screen_resolution = isset($data['screen_resolution']) ? trim(htmlspecialchars($data['screen_resolution'])) : '';
$language = isset($data['language']) ? trim(htmlspecialchars($data['language'])) : '';

writeLog("Полученные поля: name={$name}, phone={$phone}, telegram={$telegram}, contactType={$contactType}");
writeLog("Tracking metadata: client_id={$client_id}, utm_source={$utm_source}, utm_campaign={$utm_campaign}, direction={$direction}");

// Валидация обязательных полей
if (empty($name)) {
    writeLog("Ошибка: пустое имя", 'ERROR');
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Пожалуйста, заполните Имя"]);
    exit;
}

// Валидация контактных данных
if ($contactType === 'phone' && empty($phone)) {
    writeLog("Ошибка: пустой телефон", 'ERROR');
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Пожалуйста, заполните Телефон"]);
    exit;
}

if ($contactType === 'telegram' && empty($telegram)) {
    writeLog("Ошибка: пустой telegram", 'ERROR');
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Пожалуйста, заполните Telegram"]);
    exit;
}

// Формируем красивый вывод аккаунта ТГ
$tg_line = !empty($telegram) ? "@" . ltrim($telegram, "@") : "Не указан";

// Текст сообщения для Telegram (Markdown)
$text_tg = "🔥 *Новая заявка с сайта!*\n\n";
$text_tg .= "👤 *Имя:* " . $name . "\n";
$text_tg .= "📞 *Телефон:* " . (!empty($phone) ? $phone : "Не указан") . "\n";
$text_tg .= "✈️ *Telegram:* " . $tg_line . "\n";
$text_tg .= "📱 *Предпочтительный способ связи:* " . ($contactType === 'phone' ? "Телефон" : "Telegram") . "\n\n";
$text_tg .= "🎯 *Направление:* " . (!empty($direction) ? $direction : "Не указано") . "\n";
$text_tg .= "🔗 *UTM Source:* " . (!empty($utm_source) ? $utm_source : "Не указан") . "\n";
$text_tg .= "📊 *UTM Campaign:* " . (!empty($utm_campaign) ? $utm_campaign : "Не указан") . "\n";
$text_tg .= "🆔 *Client ID:* " . (!empty($client_id) ? $client_id : "Не указан") . "\n\n";
$text_tg .= "🌐 *Страница:* " . (!empty($landing_page) ? $landing_page : "Не указана") . "\n";
$text_tg .= "🔍 *Referrer:* " . (!empty($referrer) ? $referrer : "Прямой заход") . "\n\n";
$text_tg .= "📅 *Дата:* " . date("d.m.Y H:i:s");

// Текст сообщения для почты
$text_email = "Новая заявка с сайта!\n\n";
$text_email .= "Имя: " . $name . "\n";
$text_email .= "Телефон: " . (!empty($phone) ? $phone : "Не указан") . "\n";
$text_email .= "Telegram: " . $tg_line . "\n";
$text_email .= "Предпочтительный способ связи: " . ($contactType === 'phone' ? "Телефон" : "Telegram") . "\n\n";
$text_email .= "Направление: " . (!empty($direction) ? $direction : "Не указано") . "\n";
$text_email .= "UTM Source: " . (!empty($utm_source) ? $utm_source : "Не указан") . "\n";
$text_email .= "UTM Campaign: " . (!empty($utm_campaign) ? $utm_campaign : "Не указан") . "\n";
$text_email .= "Client ID: " . (!empty($client_id) ? $client_id : "Не указан") . "\n\n";
$text_email .= "Страница: " . (!empty($landing_page) ? $landing_page : "Не указана") . "\n";
$text_email .= "Referrer: " . (!empty($referrer) ? $referrer : "Прямой заход") . "\n\n";
$text_email .= "Дата: " . date("d.m.Y H:i:s");

// HTML для почты
$html_email = "<h2>Новая заявка с сайта!</h2>";
$html_email .= "<p><strong>Имя:</strong> " . $name . "</p>";
$html_email .= "<p><strong>Телефон:</strong> " . (!empty($phone) ? $phone : "Не указан") . "</p>";
$html_email .= "<p><strong>Telegram:</strong> " . $tg_line . "</p>";
$html_email .= "<p><strong>Предпочтительный способ связи:</strong> " . ($contactType === 'phone' ? "Телефон" : "Telegram") . "</p>";
$html_email .= "<p><strong>Направление:</strong> " . (!empty($direction) ? $direction : "Не указано") . "</p>";
$html_email .= "<p><strong>UTM Source:</strong> " . (!empty($utm_source) ? $utm_source : "Не указан") . "</p>";
$html_email .= "<p><strong>UTM Campaign:</strong> " . (!empty($utm_campaign) ? $utm_campaign : "Не указан") . "</p>";
$html_email .= "<p><strong>Client ID:</strong> " . (!empty($client_id) ? $client_id : "Не указан") . "</p>";
$html_email .= "<p><strong>Страница:</strong> " . (!empty($landing_page) ? $landing_page : "Не указана") . "</p>";
$html_email .= "<p><strong>Referrer:</strong> " . (!empty($referrer) ? $referrer : "Прямой заход") . "</p>";
$html_email .= "<p><strong>Дата:</strong> " . date("d.m.Y H:i:s") . "</p>";

// --- ОТПРАВКА В TELEGRAM ---
writeLog("Начинаем отправку в Telegram");
foreach ($config['telegram']['chat_ids'] as $chat_id) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.telegram.org/bot{$config['telegram']['bot_token']}/sendMessage");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'chat_id' => $chat_id,
        'text' => $text_tg,
        'parse_mode' => 'Markdown'
    ]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $result = curl_exec($ch);
    writeLog("Telegram результат (chat_id={$chat_id}): " . $result);
    
    if (curl_errno($ch)) {
        writeLog("Telegram ошибка cURL: " . curl_error($ch), 'ERROR');
    }
    
    curl_close($ch);
}
writeLog("Отправка в Telegram завершена");

// --- ОТПРАВКА НА ПОЧТУ ---
$mail_success = false;
$mail_error = '';

if ($config['mail_method'] === 'mail') {
    writeLog("Начинаем отправку на почту через PHP mail()");
    try {
        // Заголовки для письма (важно для правильной кодировки и отправителя)
        $boundary = md5(time());
        $headers = "From: {$config['timeweb_mail']['from_name']} <{$config['timeweb_mail']['from_email']}>\r\n";
        $headers .= "Reply-To: {$config['timeweb_mail']['from_email']}\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: multipart/alternative; boundary=\"{$boundary}\"\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        // Тело письма с HTML и plain text
        $body = "--{$boundary}\r\n";
        $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
        $body .= $text_email . "\r\n\r\n";
        $body .= "--{$boundary}\r\n";
        $body .= "Content-Type: text/html; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
        $body .= $html_email . "\r\n\r\n";
        $body .= "--{$boundary}--";

        // Тема письма
        $subject = "=?UTF-8?B?" . base64_encode("Новая заявка с сайта Movly") . "?=";

        // Отправляем письмо каждому получателю
        foreach ($config['timeweb_mail']['admin_emails'] as $to_email) {
            writeLog("Отправляем письмо на {$to_email}");
            // Важно: параметр -f для указания отправителя (согласно документации Timeweb)
            $result = mail($to_email, $subject, $body, $headers, "-f{$config['timeweb_mail']['from_email']}");
            
            if ($result) {
                writeLog("Письмо на {$to_email} отправлено успешно!", 'SUCCESS');
                $mail_success = true;
            } else {
                $mail_error = "Не удалось отправить письмо на {$to_email}";
                writeLog($mail_error, 'ERROR');
            }
        }
    } catch (Exception $e) {
        $mail_error = "Ошибка отправки почты: " . $e->getMessage();
        writeLog($mail_error, 'ERROR');
    }
} elseif ($config['mail_method'] === 'smtp') {
    writeLog("Начинаем отправку на почту через SMTP Timeweb");
    require_once __DIR__ . '/vendor/autoload.php';

    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    try {
        // Настройки SMTP
        $mail->isSMTP();
        $mail->Host = $config['timeweb_smtp']['host'];
        $mail->SMTPAuth = true;
        $mail->Username = $config['timeweb_smtp']['username'];
        $mail->Password = $config['timeweb_smtp']['password'];
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $config['timeweb_smtp']['port'];
        $mail->CharSet = 'UTF-8';

        writeLog("SMTP настройки: host={$config['timeweb_smtp']['host']}, port={$config['timeweb_smtp']['port']}, username={$config['timeweb_smtp']['username']}");

        // Отправитель
        $mail->setFrom($config['timeweb_smtp']['from_email'], $config['timeweb_smtp']['from_name']);
        writeLog("Отправитель: {$config['timeweb_smtp']['from_email']}");

        // Получатели
        foreach ($config['timeweb_smtp']['admin_emails'] as $email) {
            $mail->addAddress($email);
            writeLog("Добавлен получатель: {$email}");
        }

        // Содержимое письма
        $mail->isHTML(true);
        $mail->Subject = "Новая заявка с сайта Movly";
        $mail->Body    = $html_email;
        $mail->AltBody = $text_email;

        writeLog("Пытаемся отправить письмо...");
        $mail->send();
        $mail_success = true;
        writeLog("Письмо отправлено успешно!", 'SUCCESS');
    } catch (Exception $e) {
        $mail_error = "Ошибка отправки почты: " . $mail->ErrorInfo;
        writeLog($mail_error, 'ERROR');
    }
}

// Успешный ответ для AJAX
http_response_code(200);
echo json_encode([
    "status" => "success",
    "message" => "Спасибо! Наш специалист свяжется с вами в ближайшее время.",
    "debug" => [
        "mail_success" => $mail_success,
        "mail_error" => $mail_error
    ]
]);
writeLog("=== Запрос завершен ===");
exit;
