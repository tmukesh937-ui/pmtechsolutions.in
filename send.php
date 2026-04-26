<?php
/**
 * PMTech Solutions — Contact Form Handler (PHPMailer Version)
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// Include PHPMailer classes from the local folder
require 'PHPMailer-master/src/Exception.php';
require 'PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/src/SMTP.php';

// ─── Enable error reporting for debugging (Remove in production) ─────────────
ini_set('display_errors', 1);
error_reporting(E_ALL);
// ─────────────────────────────────────────────────────────────────────────────

// Configuration - UPDATE THESE SETTINGS
$smtpHost = 'smtp.gmail.com';             // SMTP server (e.g., smtp.gmail.com)
$smtpUsername = 'tmukesh937@gmail.com';       // Your email address
$smtpPassword = 'qcsbbgeuctazssab';          // Your Gmail App Password (NOT your regular password)
$smtpPort = 587;                          // 465 for SSL, 587 for TLS
$mailTo = 'tmukesh937@gmail.com';       // Where to receive the enquiries

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

// Sanitize inputs
$name = trim(htmlspecialchars($_POST['name'] ?? ''));
$email = trim(htmlspecialchars($_POST['email'] ?? ''));
$phone = trim(htmlspecialchars($_POST['phone'] ?? ''));
$message = trim(htmlspecialchars($_POST['message'] ?? ''));

// Validate
if (empty($name) || empty($email) || empty($message) || empty($phone) || !filter_var($email, FILTER_VALIDATE_EMAIL) || !preg_match('/^[0-9]{10}$/', $phone)) {
    file_put_contents('enquiries.log', date('Y-m-d H:i:s') . " | INVALID | {$name} | {$email} | {$phone}\n", FILE_APPEND);
    header('Location: thank-you.html');
    exit;
}

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host = $smtpHost;
    $mail->SMTPAuth = true;
    $mail->Username = $smtpUsername;
    $mail->Password = $smtpPassword;

    // Automatically set encryption based on port
    if ($smtpPort == 465) {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    } else {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    }

    $mail->Port = $smtpPort;

    // Recipients
    $mail->setFrom($smtpUsername, 'PMTech Website Form');
    $mail->addAddress($mailTo);
    $mail->addReplyTo($email, $name);

    // Content
    $mail->isHTML(true);
    $mail->Subject = "New Enquiry from PMTech Website - $name";

    $mail->Body = "
    <html>
    <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
        <div style='max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;'>
            <div style='background: linear-gradient(135deg, #6c63ff, #00d4ff); padding: 20px; text-align: center;'>
                <h2 style='color: #fff; margin: 0;'>New Website Enquiry</h2>
            </div>
            <div style='padding: 20px;'>
                <p><strong>Name:</strong> {$name}</p>
                <p><strong>Email:</strong> <a href='mailto:{$email}'>{$email}</a></p>
                <p><strong>Phone:</strong> " . ($phone ?: 'Not provided') . "</p>
                <hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;'>
                <p><strong>Message:</strong></p>
                <div style='background: #f9f9f9; padding: 15px; border-left: 4px solid #6c63ff; white-space: pre-wrap;'>{$message}</div>
            </div>
            <div style='background: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; color: #777;'>
                Sent via PMTech Website Contact Form
            </div>
        </div>
    </body>
    </html>";

    $mail->send();
    $logStatus = "SUCCESS";
} catch (Exception $e) {
    $logStatus = "FAILED: " . $mail->ErrorInfo;
}

// Log results
$logEntry = date('Y-m-d H:i:s') . " | {$logStatus} | Name: {$name} | Email: {$email}\n";
file_put_contents('enquiries.log', $logEntry, FILE_APPEND);

// Success redirect
header('Location: thank-you.html');
exit;

