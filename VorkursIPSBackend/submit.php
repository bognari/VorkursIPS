<?php
/**
 * Created by IntelliJ IDEA.
 * User: stephan
 * Date: 28.06.15
 * Time: 16:45
 */

require_once 'vendor/autoload.php';

$data = json_decode(file_get_contents('php://input'), true);

//var_dump($data);

if (isValid($data)) {
    if (save($data) === false) {
        header('HTTP/1.0 400 Bad Request');
    }
} else {
    header('HTTP/1.0 403 Forbidden');
}

function isValid($input) {
    if (!(array_key_exists('lastname', $input) && is_string($input['lastname']) && $input['lastname'] !== '')) {
        return false;
    }
    if (!(array_key_exists('firstname', $input) && is_string($input['firstname']) && $input['firstname'] !== '')) {
        return false;
    }
    if (!(array_key_exists('email', $input) && is_string($input['email']) && filter_var($input['email'], FILTER_VALIDATE_EMAIL) !== false)) {
        return false;
    }
    return true;
}

/**
 * @param $input
 * @return SQLite3Result
 */
function save($input) {
    $db = new SQLite3('vorkurs.db');

    $group = '';

    if ($input['cs'] === true && $input['math'] === true) {
        $group = 'afternoon';
        //echo 'both';
    } else if ($input['math'] === true) {
        $stmtCount = $db->prepare('SELECT count(*) FROM vorkurs WHERE math = 1 AND mathgroup = :group');

        $stmtCount->bindValue(':group', 'afternoon');
        $result = $stmtCount->execute()->fetchArray();
        $countAfternoon = $result[0];
        $stmtCount->clear();

        $stmtCount->bindValue(':group', 'morning');
        $result = $stmtCount->execute()->fetchArray();
        $countMorning = $result[0];

        $group = 'morning';
        if ($countMorning > $countAfternoon + 10) {
            $group = 'afternoon';
        }
    }

    $stmt = $db->prepare('INSERT INTO vorkurs VALUES (:email, :lastname, :firstname, :math, :cs, :mathgroup, :laptop, :proglang, :os,
:school)');
    $stmt->bindValue(':lastname', $input['firstname'], SQLITE3_TEXT);
    $stmt->bindValue(':firstname', $input['lastname'], SQLITE3_TEXT);
    $stmt->bindValue(':email', $input['email'], SQLITE3_TEXT);
    $stmt->bindValue(':math', $input['math'] === true ? 1 : 0, SQLITE3_INTEGER);
    $stmt->bindValue(':cs', $input['cs'] === true ? 1 : 0, SQLITE3_INTEGER);
    $stmt->bindValue(':mathgroup', $group, SQLITE3_TEXT);
    $stmt->bindValue(':laptop', $input['laptop'], SQLITE3_TEXT);
    $stmt->bindValue(':proglang', $input['proglang'], SQLITE3_TEXT);
    $stmt->bindValue(':os', $input['os'], SQLITE3_TEXT);
    $stmt->bindValue(':school', $input['school'], SQLITE3_TEXT);


    $ret = $stmt->execute();

    if ($ret !== false) {
        $mail = new PHPMailer();
        $mail->From = 's.mielke@tu-bs.de';
        $mail->FromName = 'Stephan Mielke';
        $mail->addAddress($input['email']);     // Add a recipient

        if ($group === 'afternoon') {
            //echo 'after';
            $mail->addAttachment('Brief-NM-2015.pdf');
        }
        if ($group === 'morning') {
            //echo 'morning';
            $mail->addAttachment('Brief-VM-2015.pdf');
        }
        if ($input['cs'] === true) {
            //echo 'cs';
            $mail->addAttachment('Einladung-VK-Info.pdf');
        }

        $mail->isHTML(true);                                  // Set email format to HTML

        $mail->Subject = 'Bestätigung der Anmeldung für den Vorkurs';
        $mail->Body    = 'Mit dieser Email erhalten Sie im Anhang alle wichtigen Informationen zum Vorkurs.';
        $mail->AltBody = 'Mit dieser Email erhalten Sie im Anhang alle wichtigen Informationen zum Vorkurs.';

        if(!$mail->send()) {
            echo 'Message could not be sent.';
            echo 'Mailer Error: ' . $mail->ErrorInfo;
        } else {
            echo 'Message has been sent';
        }
    }

    return $ret;
}