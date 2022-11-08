export function getCookie(name: string) : string {
	const value = `; ${document.cookie}`;
	// eslint-disable-next-line
	const parts: any = value.split(`; ${name}=`); // Fuck type script fuck Es lint A voir si on peux fix
	if (parts.length === 2)
	{
	  return (parts.pop().split(';').shift());
	  
	}
	else
	  return "";
}