<?php
// Handle repair request form submission
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Get JSON data from request
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($data['fname']) || !isset($data['lname']) || !isset($data['phone']) || 
    !isset($data['deviceType']) || !isset($data['deviceModel']) || !isset($data['repairType']) || 
    !isset($data['issue'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields'
    ]);
    exit;
}

$fname = sanitize($data['fname']);
$lname = sanitize($data['lname']);
$phone = sanitize($data['phone']);
$email = sanitize($data['email'] ?? '');
$deviceType = sanitize($data['deviceType']);
$deviceModel = sanitize($data['deviceModel']);
$repairType = sanitize($data['repairType']);
$issue = sanitize($data['issue']);
$serviceOption = sanitize($data['serviceOption'] ?? '');
$source = sanitize($data['source'] ?? '');

// Email to your repair inbox
$to = 'crestapex0@gmail.com';
$subject = 'New Repair Request - ' . $fname . ' ' . $lname;

// Create HTML email content
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
    </style>
</head>
<body>
    <h2>New Repair Request Received</h2>
    <hr/>
    
    <h3>Customer Information</h3>
    <p><strong>Name:</strong> ' . $fname . ' ' . $lname . '</p>
    <p><strong>Phone:</strong> ' . $phone . '</p>
    <p><strong>Email:</strong> ' . ($email ?: 'Not provided') . '</p>
    
    <h3>Device Information</h3>
    <p><strong>Device Type:</strong> ' . $deviceType . '</p>
    <p><strong>Brand & Model:</strong> ' . $deviceModel . '</p>
    
    <h3>Repair Details</h3>
    <p><strong>Repair Type:</strong> ' . $repairType . '</p>
    <p><strong>Issue Description:</strong></p>
    <p>' . nl2br($issue) . '</p>
    
    <h3>Service Preferences</h3>
    <p><strong>Service Option:</strong> ' . ($serviceOption ?: 'Not specified') . '</p>
    <p><strong>Source:</strong> ' . ($source ?: 'Not specified') . '</p>
    
    <hr/>
    <p><em>Received at: ' . date('Y-m-d H:i:s') . '</em></p>
</body>
</html>
';

// Headers for HTML email
$headers = "MIME-Version: 1.0" . "
";
$headers .= "Content-type: text/html; charset=UTF-8" . "
";
$headers .= "From: hello@adogroup.org" . "
";

// Send email to your account
if (mail($to, $subject, $emailContent, $headers)) {
    if ($email) {
        sendCustomerConfirmation($email, $fname, $phone, $deviceType, $deviceModel, $repairType, $serviceOption);
    }
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Repair request submitted successfully',
        'phone' => $phone
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error submitting repair request. Please try again later.'
    ]);
}

function sanitize($data) {
    if (is_array($data)) {
        return array_map('sanitize', $data);
    }
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

function sendCustomerConfirmation($email, $fname, $phone, $deviceType, $deviceModel, $repairType, $serviceOption) {
    $subject = 'Repair Request Confirmed - Ado Group';
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
        <h2>We\'ve Received Your Repair Request!</h2>
        <p>Hi ' . $fname . ',</p>
        <p>Thank you for submitting your repair request. We\'ll contact you on <strong>' . $phone . '</strong> within 30 minutes to confirm your booking and provide a free quote.</p>
        
        <h3>Your Request Summary:</h3>
        <p><strong>Device:</strong> ' . $deviceType . ' - ' . $deviceModel . '</p>
        <p><strong>Repair Type:</strong> ' . $repairType . '</p>
        <p><strong>Service Option:</strong> ' . ($serviceOption ?: 'Not specified') . '</p>
        
        <p>If you have any questions in the meantime, feel free to call us:</p>
        <p>📞 +23407072413082</p>
        
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
