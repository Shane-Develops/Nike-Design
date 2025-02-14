<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $address = htmlspecialchars($_POST['address']);
    $city = htmlspecialchars($_POST['city']);
    $state = htmlspecialchars($_POST['state']);
    $zip_code = htmlspecialchars($_POST['zip_code']);
    $card_number = htmlspecialchars($_POST['card_number']);
    $expiry_date = htmlspecialchars($_POST['expiry_date']);
    $cvc = htmlspecialchars($_POST['cvc']);
    $cart = json_decode($_POST['cart'], true);
    
    $subtotal = 0;
    foreach ($cart as $item) {
        $subtotal += floatval(str_replace('$', '', $item['price'])) * $item['quantity'];
    }
    $tax = $subtotal * 0.06;
    $total = $subtotal + $tax;
    $masked_card_number = str_repeat('*', 12) . substr($card_number, -4);
    $date_of_purchase = date("Y-m-d H:i:s");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Receipt</title>
    <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Cabinet Grotesk', sans-serif;
            background-color: #FAF9F6;
            color: #181818;
        }
        .receipt-container {
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background-color: white;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .receipt-container h1, .receipt-container h2 {
            color: #333;
        }
        .receipt-container p, .receipt-container ul {
            color: #555;
        }
        .receipt-container ul {
            list-style-type: none;
            padding: 0;
        }
        .receipt-container ul li {
            margin-bottom: 10px;
        }
        .receipt-container a {
            display: inline-block;
            margin-top: 20px;
            text-decoration: none;
            color: white;
            background-color: #333;
            padding: 10px 20px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <h1 class="text-3xl font-bold mb-6">Receipt</h1>
        <p><strong>Name:</strong> <?php echo $name; ?></p>
        <p><strong>Email:</strong> <?php echo $email; ?></p>
        <p><strong>Address:</strong> <?php echo $address . ', ' . $city . ', ' . $state . ' ' . $zip_code; ?></p>
        <p><strong>Date of Purchase:</strong> <?php echo $date_of_purchase; ?></p>
        <h2 class="text-2xl font-bold mt-6 mb-4">Summary of Purchase</h2>
        <ul>
            <?php foreach ($cart as $item): ?>
                <li><?php echo $item['name']; ?> x<?php echo $item['quantity']; ?> - $<?php echo number_format(floatval(str_replace('$', '', $item['price'])) * $item['quantity'], 2); ?></li>
            <?php endforeach; ?>
        </ul>
        <p><strong>Subtotal:</strong> $<?php echo number_format($subtotal, 2); ?></p>
        <p><strong>Tax (6%):</strong> $<?php echo number_format($tax, 2); ?></p>
        <p><strong>Total:</strong> $<?php echo number_format($total, 2); ?></p>
        <p><strong>Credit Card:</strong> <?php echo $masked_card_number; ?></p>
        <a href="index.html" class="mt-4 inline-block bg-black text-white py-2 px-4 rounded">Go Back to Home Page</a>
    </div>
</body>
</html>