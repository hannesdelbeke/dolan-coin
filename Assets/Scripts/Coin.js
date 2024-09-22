#pragma strict

var amount : int = 1; 
var timer : float = 5;
private var starttimer : float = 5;
var startPos : Vector3;	
var maxHeight : float = 10 ;
var maxWidth : float = 5 ;
private var manager : GameObject;
private var target : GameObject;
private var landed : boolean = false;
private var lvlmanager : LevelManager;
private var randcoinspeed : float = 1;


function Start () {
randcoinspeed *= (Random.value+0.5);
	manager = GameObject.Find("Manager");
	lvlmanager = manager.GetComponent(LevelManager);
	timer = (lvlmanager.PickupLevel+10* Random.value ) / ( Random.value *4 )+1;
	starttimer=timer;
	startPos = transform.position;

	target= lvlmanager.cointarget;
	maxHeight= Random.value*maxHeight ;
	maxWidth= Random.value*maxWidth - maxWidth/2 ;

}

function Update () {

	if( timer<= 0)
	//if(phase1 == false)
	//activate phase 1
	//else
	//timer = 2;
	Destroy(gameObject);
	else
	timer -= Time.deltaTime ;
	/*
	else
	transform.position = Vector3.MoveTowards(transform.position, target.transform.position,0.1 );
	*/
	Jump();
}

function SetAmount (myamount : int )
{
	amount = myamount ;
}

function Jump ( )
{
	if(landed == false)
	{
		if(transform.position.y >= startPos.y  )
		{
			transform.position.y = startPos.y + (starttimer-timer)*maxHeight - (starttimer-timer)*(starttimer-timer)*9.81;
			transform.position.x += Time.deltaTime*maxWidth;
		}
		else
		{
			transform.position.y = startPos.y-0.01 ;
			landed=true;
			print("land");
		}
	}
	else
	{	
		transform.position.y=target.transform.position.y;
		transform.position.z=target.transform.position.z;
		
		var coinspeed : float = lvlmanager.PickupSpeed/(amount )/50 * randcoinspeed ;
		if(transform.position.x>target.transform.position.x)
		transform.position.x -= coinspeed;
		else
		transform.position.x += coinspeed;
		
		var dist = Vector3.Distance(transform.position, target.transform.position);
		if(dist<0.2)
		{	
			lvlmanager.Money +=  amount;
			lvlmanager.AddPickupExp(amount);			
			Destroy(gameObject);
		}
	}
}