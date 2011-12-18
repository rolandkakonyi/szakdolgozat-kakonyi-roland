/*======= Lagrange.c  :  Lagrange polinom illesztÇse pontsorozatra ======
  majd a polinom tabell†z†sa adott intervallumban Çs lÇpÇskîzzel.
  Bemeneti adatok a szabv†nyos bemenetrãl:
    - az illesztendã polinom foksz†ma, egÇsz, >1    - az alappontok x,y ertÇkei, foksz†m+1 val¢s sz†mp†r    - mettãl meddig list†zza ki az illesztett polinom ertÇkeit, val¢s sz†mp†r    - h†ny pontban list†zza ki az elãbbi ÇrtÇkeket, egÇsz, >1
  EredmÇnyek a szabv†nyos kimeneten:
    - a Lagrange polinom egyÅtthat¢i, foksz†m+1 val¢s sz†m    - az x es a polinom ÇrtÇkek az adott intervallumban es pontsz†mmal.
  VisszatÇrÇsi ÇrtÇkek:
    = 0  : O.K.    =-1  : nincs elÇg mem¢ria a Lagrange fÅggvÇny belsã m†trix†nak    = 1  : az alappontok x ÇrtÇkei kîzîtt vannak azonosak    = 2  : foksz†m < 1  (hib†s bemeneti adat)    = 3  : nincs elÇg mem¢ria a beolvasand¢ adatoknak vagy az eredmÇnynek----------------------------------------------------------------------------*/
#include <math.h>#include <stdio.h>#include <stdlib.h>
#ifndef FALSE#define FALSE  0#endif
#ifndef TRUE#define TRUE   1#endif
typedef double *vektor ;  /* a vektor: double adatokra mutat¢ t°pus */
typedef vektor *matrix ;  /* a matrix: vektor-ra mutat */
vektor VektorAlloc(int n) {    vektor v;    if ((v = (vektor)malloc(n*sizeof(*v))) == NULL) {       fprintf(stderr,"Nincs elÇg mem¢ria!\n");       exit (1);    }    return v;}
matrix MatrixAlloc(int n,int m) {    matrix a;    int i;    if ((a = (matrix)malloc(n*sizeof(*a))) == NULL) {
	       /* n darab mutat¢nak kell a hely */       fprintf(stderr,"Nincs elÇg mem¢ria!\n");       exit (1);    }    for (i=0;i<n;i++)
      a[i]=VektorAlloc(m); /* minden sorvektornak helyet foglalunk Çs a
			      kezdãc°mÇt feljegyezzÅk */    return a;}
void MatrixFree(matrix a,int n) {    int i;    for (i=0;i<n;i++) free(a[i]);  /* a sorvektorok felszabad°t†sa */    free(a);                       /* mutat¢tîmb felszabad°t†sa */}
int G_Elim     /*========== Gauss elimin†ci¢ ==========*/       ( int n,                /* tÇnyleges mÇret */	 matrix a,             /* n*(n+1) rÇsze feltîltve */	 vektor x,             /* megold†s */	 double *det,          /* determin†ns, kimenã adat */	 double min_ertek )    /* hibahat†r */{  int i,j,k;  double s;
  *det=1.0;  for (i=0;  i<n;  i++) {                    /* i-edik sorral elimin†lunk */    s=a[i][i];                               /* fã†tl¢beli elem */    *det *= s;    if (fabs(s)<min_ertek) {       return FALSE;    /* t£l kicsi */    }    s=1/s;                                   /* szorozni gyorsabb */    for (k=i+1;  k<n+1;  k++)  a[i][k]*=s;   /* fã†tl¢ban elvileg 1 lett */
    for (j=i+1;  j<n;  j++) {                /* i. oszlop elimin†l†sa */      s=a[j][i];      for (k=i+1;  k<n+1;  k++)              /* j. sor elemei i. oszlopt¢l */	a[j][k] -= s*a[i][k];    }  };   /* most elvileg a fã†tl¢ban 1, alatta 0 van */
  x[n-1]=a[n-1][n];                          /* x[] meghat. */
  for (i=n-2;  i>=0;  i--) {    s=a[i][n];    for (k=i+1;  k<n;  k++)  s -= a[i][k]*x[k];    x[i]=s;  }  return TRUE;                                 /* G_Elim rendben */}   /* func. G_Elim */
/*=============== Lagrange polinom meghat†roz†sa ===================*/
void  Lagrange (int  fok,              /* foksz†m, = alappontok sz†ma -1 */		vektor x, vektor y,    /* alappontok x,y ÇrtÇkei */		vektor p,              /* Lagrange polinom egyÅtthat¢i */                int *hiba)             /* = 0  : O.K.					  = 1  : alappontok x ÇrtÇkei						 nem kÅlînbîzãek					  =-1  : nincs elÇg mem¢ria */
 /*  M¢dszer:  az x,y alappontokb¢l feltîltjÅk a kîvetkezã egyenletrendszert:
              p0 + x0*p1 + x0^2*p2 + x0^3*p3 + ... + x0^n*pn = y0
              p0 + x1*p1 + x1^2*p2 + x1^3*p3 + ... + x1^n*pn = y1
              p0 + x2*p1 + x2^2*p2 + x2^3*p3 + ... + x2^n*pn = y2
               ...
              p0 + xn*p1 + xn^2*p2 + xn^3*p3 + ... + xn^n*pn = yn
     majd ezt az (n+1) ismeretlenes egyenletrendszert megoldjuk p0 ... pn  -re.
 */
{  matrix m;      /* x hatv†nyok, y ÇrtÇkek (n+1)*(n+2) meret˚ m†trixa */  int    k,h;  double xh;                     /* x^h */
  double det;                    /* egyÅtthat¢m†trix determin†nsa */  const double minelem=1e-8;     /* min. fã†tl¢beli elem Gauss elimin†ci¢ban */
  m = MatrixAlloc(fok+1,fok+2);
  for (k=0;  k<=fok;  k++) {     /* m†trix feltîltÇse: k. sor */    xh=1.0;    for (h=0;  h<=fok;  h++) {   /* k. sor elemei */      m[k][h]=xh;    /* x^h */      xh*=x[k];                  /* kîvetkezã hatv†ny */    }    m[k][fok+1]=y[k];  /* egyenletrendszer jobb oldala */  }
  *hiba=G_Elim (fok+1, m, p, &det, minelem);
  MatrixFree (m,fok+1);
}   /* Lagrange */
/*===== Polinom ÇrtÇkÇnek meghat†roz†sa Horner m¢dszerrel =====*/
double  Horner (int n,           /* fokszam */		double *p,       /* polinom egyÅtthat¢i, (n+1 elem˚) */		double  x)       /* e pontban kell a polinom ÇrtÇke */{  int k;   double w=0.0;   for (k=n;  k>=0;  k--)  w=w*x+p[k];   return w;}
int main(void)  /*===================== Fãprogram ========================*/
{  vektor x,y,polinom;       /* fok+1 elem˚ vektorok */  int fok=0,                /* polinom foksz†ma, fok+1 alappont van */      hiba,                 /* Volt hiba a Lagrange kîzelitÇsben? */      psz,k;                /* tabell†z†s pontsz†ma, ciklusv†ltoz¢ */  double xa,xf,dx,xx;       /* tabell†z†s hat†rai, lÇpÇskîze, x ÇrtÇke */
  printf("\n===== Lagrange.c  :  Lagrange polinom illesztÇse pontsorozatra ====="    "\n      majd a polinom tabell†z†sa adott intervallumban Çs lÇpÇskîzzel\n");
  printf("\n Foksz†m = ");   scanf("%d",&fok);
  if (fok<=0) {    printf(" ***** Foksz†m csak a pozit°v lehet *****\n");    return 2;  }
  x=VektorAlloc(fok+1);  y=VektorAlloc(fok+1);  polinom=VektorAlloc(fok+1);
  printf(" Az alappontok x y ÇrtÇkei  (%d val¢s sz†mp†r) :\n  ", fok+1);  for (k=0;  k<=fok;  k++)    if (scanf("%lf %lf", &x[k], &y[k])<2) {	 fprintf(stderr,"\n***** KevÇs vagy hib†s bemeneti adat *****\n");         return 2;    }
  Lagrange (fok,x,y,polinom,&hiba);
  if (hiba==FALSE) {    printf("\n ***** Hiba a Lagrange kîzel°tÇsben : *****"	   "\n   alappontok x ÇrtÇkei nem kÅlînbîzãek\n" );    return 1;  }
  printf(" ==> A polinom egyÅtthat¢i :   ");  for (k=0;  k<=fok;  k++)    printf("%9.3f", polinom[k]);
  printf("\n A tabell†z†s als¢, felsã hat†ra Çs pontsz†ma : ");  scanf("%lf %lf %d", &xa,&xf,&psz);
  dx=(xf-xa)/(psz-1);
  printf("\n       x         p(x)\n");  for (k=1, xx=xa;  k<=psz;  xx+=dx, k++)    printf("%10.3f %10.3f\n", xx, Horner(fok,polinom,xx));  return 0;}