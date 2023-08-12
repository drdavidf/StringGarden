
create table player (
	nickname char(20),
	eid varchar(128),
	uid integer primary key
);

create table game (
	name varchar(128),
	uid integer primary key
);

create table session (
	score integer,
	level integer,
	time timestamp,
	player integer references player(uid),
	game integer references game(uid)
);
	
