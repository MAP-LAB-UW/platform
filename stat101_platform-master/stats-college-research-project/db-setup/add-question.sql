USE stat101_test;

INSERT INTO question_entity(question) VALUES(
	"What is the corresponding z-score for a percentage of 68?"
);

INSERT INTO item_bank(question_entity_id, correct_answers) VALUES(
	(SELECT id FROM question_entity WHERE question_entity.id = 1),
    'a'
);

INSERT INTO option_entity(item_id, choice, choice_label) VALUES
	(
		(SELECT id FROM item_bank WHERE item_bank.id = 1),
		"1",
		"a"
    ),
    (
		(SELECT id FROM item_bank WHERE item_bank.id = 1),
        "2",
        "b"
    ),
    (
		(SELECT id FROM item_bank WHERE item_bank.id = 1),
        "3",
        "c"
    ),
    (
		(SELECT id FROM item_bank WHERE item_bank.id = 1),
        "2",
        "d"
    );

INSERT INTO item_tag(tag_name) VALUES(
    "Normal Curves"
);

INSERT INTO tag_item_rel(item_id, tag_id) VALUES(
	(SELECT id FROM item_bank WHERE item_bank.id = 1),
    (SELECT id FROM item_tag WHERE item_tag.tag_name = "Normal Curves")
);