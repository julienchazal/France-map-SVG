<?php

$data['sessions'] = array (
   "1125" => array (
      "id_session"=>"1125",
      "ville_session"=>"Toulouse",
      "formated_date_session"=>"21 février 2014",
      "heure_session"=>"10h-11h30",
      "tel_contact"=>"05 67 70 65 65",
      "mail_contact"=>"mandataire@safti.fr",
      "idVille"=>"26"  
   ),
   "1126" => array (
      "id_session" => "1126",
      "ville_session" => "Toulouse",
      "formated_date_session" => "24 février 2014",
      "heure_session" => "10h-11h30",
      "tel_contact" => "05 67 70 65 65",
      "mail_contact" => "mandataire@safti.fr",
      "idVille" => "26" 
   ),
   "1127" => array (
      "id_session" => "1127",
      "ville_session" => "Toulouse",
      "formated_date_session" => "27 février 2014",
      "heure_session" => "10h-11h30",
      "tel_contact" => "05 67 70 65 65",
      "mail_contact" => "mandataire@safti.fr",
      "idVille" => "26" 
   ),
   "1128" => array (
      "id_session" => "1128",
      "ville_session" => "Gourdon",
      "formated_date_session" => "7 mars 2014",
      "heure_session" => "11h-12h30",
      "tel_contact" => "05 67 70 65 65",
      "mail_contact" => "mandataire@safti.fr",
      "idVille" => "193" 
   )
);

header('Content-Type: application/json');
echo json_encode($data);

?>