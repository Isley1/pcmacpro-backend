<?php
// Handle contact form submission
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['fname']) || !isset($data['lname']) || !isset($data['email']) || 
    !isset($data['subject']) || !isset($data['message'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields'
    ]);
    exit;
}

$fname = sanitize($data['fname']);
$lname = sanitize($data['lname']);
$email = sanitize($data['email']);
$phone = sanitize($data['phone'] ?? '');
$subject = sanitize($data['subject']);
$message = sanitize($data['message']);

$to = 'crestapex0@gmail.com';
$emailSubject = 'Contact Form Inquiry - ' . $subject;

$emailContent = '
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        h2 { color: #1baaaa; }
        h3 { color: #004e89; margin-top: 20px; }
        hr { border: 1px solid #ddd; }
        p { margin: 8px 0; }
        strong { color: #004e89; }
        .message-box { 
            background-color: #f5f5f5; 
            padding: 15px; 
            border-left: 4px solid #1baaaa;
            margin: 20px 0;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
    </style>
</head>
<body>
    <h2>New Contact Form Inquiry</h2>
    <hr/>
    
    <h3>Contact Information</h3>
    <p><strong>Name:</strong> ' . $fname . ' ' . $lname . '</p>
    <p><strong>Email:</strong> ' . $email . '</p>
    ' . ($phone ? '<p><strong>Phone:</strong> ' . $phone . '</p>' : '') . '
    
    <h3>Subject</h3>
    <p>' . $subject . '</p>
    
    <h3>Message</h3>
    <div class="message-box">' . $message . '</div>
    
    <hr/>
    <p><em>Received at: ' . date('Y-m-d H:i:s') . '</em></p>
</body>
</html>
';

$headers = "MIME-Version: 1.0" . "
";
$headers .= "Content-type: text/html; charset=UTF-8" . "
";
$headers .= "From: hello@adogroup.org" . "
";
$headers .= "Reply-To: " . $email . "
";

if (mail($to, $emailSubject, $emailContent, $headers)) {
    sendUserConfirmation($email, $fname);
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Your message has been sent successfully. We will get back to you soon!'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error sending your message. Please try again later.'
    ]);
}

function sanitize($data) {
    if (is_array($data)) {
        return array_map('sanitize', $data);
    }
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

function sendUserConfirmation($email, $fname) {
    $subject = 'We Received Your Message - Ado Group';
    $content = '
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; color: #333; }
            h2 { color: #1baaaa; }
            p { margin: 8px 0; line-height: 1.6; }
        </style>
    </head>
    <body>
        <h2>Thank You for Contacting Us!</h2>
        <p>Hi ' . $fname . ',</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        
        <p>In the meantime, feel free to reach out to us directly:</p>
        <p>📞 <strong>+23407072413082</strong></p>
        <p>📧 <strong>hello@adogroup.org</strong></p>
        <p>📍 Lagos, Nigeria</p>
        
        <p>Best regards,<br>Ado Group Team</p>
    </body>
    </html>
    ';
    $headers = "MIME-Version: 1.0" . "
";
    $headers .= "Content-type: text/html; charset=UTF-8" . "
";
    $headers .= "From: hello@adogroup.org" . "
";
    mail($email, $subject, $content, $headers);
}
?>
