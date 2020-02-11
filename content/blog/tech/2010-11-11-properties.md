---
title: Properties
categories:
- Objective-C
date: "2010-11-11T00:00:00Z"
description: Uma visão básica de properties e o modelo de gerência de memória em Objective-C.
keywords: objective-c, iphone, ios, cocoa, cocoatouch
---

**Observação: existe grande possibilidade de eu estar falando alguma merda, sou
novo no Objective-C :-)**

## Gerenciamento de memória &mdash; o básico

Para alocar um objeto no Objective-C, é necessário basicamente
chamar dois métodos: o `alloc` e o `init`. Em
termos simples, o `alloc` é um método mais baixo nível
e serve para alocar memória para o objeto (parecido com a família
`*alloc` no C). O `init` e suas variações,
correspondem ao construtor:

```objectivec
NSString* coolString = [[NSString alloc] init];
NSString* anotherCoolString = [[NSString alloc]
                                initWithString:@"Cool string!"];

[coolString release];
[anotherCoolString release];
```

O controle de memória feito internamente pelo Objective-C é simples. No momento
que eu faço `alloc`, o número de referências para o objeto
é incrementado. Quando faço `release`, esse número é reduzido. Quando
o contador chega a zero, o objeto é liberado da memória:

![Reference Counting](/images/posts/properties/refcount.png)
**Fonte da imagem: [Cocoa Dev Central](http://cocoadevcentral.com)**

O `retain` usamos para uma situação um pouco diferente &mdash; usamos
quando queremos declaradamente aumentar a contagem de referência para um mesmo
objeto em memória, por exemplo, quando queremos guardar aquela referência em um
outro objeto.


> *Mas e o garbage collector?*
>
> No Objective-C, é possível usar um dos parâmetros na compilação:
>
> * -fobjc-gc-only: Há apenas Garbage Collector
> * -fobjc-gc: Suporta GC e `retain/release`
>
> A questão é que eles não podem ser usados em aplicações iOS por enquanto,
> apenas no Snow Leopard.

> Mais detalhes em [Garbage Collection for Cocoa Essential](http://developer.apple.com/library/mac/#documentation/Cocoa/Conceptual/GarbageCollection/Articles/gcEssentials.html#//apple_ref/doc/uid/TP40002452-SW1)

## Getters e Setters

Vamos a um exemplo um pouco mais complexo, na nossa boa e velha classe
`Car`:

Car.h
```objectivec
#import <Cocoa/Cocoa.h>


@interface Car : NSObject
{
    NSString* manufacturer;
    NSString* model;
}

- (NSString *)getManufacturer;
- (NSString *)getModel;

- (void)setManufacturer:(NSString *)input;
- (void)setModel:(NSString *)input;

@end
```


Car.m

```objectivec
#import "Car.h"

@implementation Car

- (NSString *)getManufacturer
{
    return manufacturer;
}

- (NSString *)getModel
{
    return model;
}

- (void)setManufacturer:(NSString *)input
{
    if(input != manufacturer)
    {
        [manufacturer release];
        manufacturer = [input retain];
    }
}
- (void)setModel:(NSString *)input
{
    if(input != model)
    {
        [model release];
        model = [input retain];
    }
}

- (void)dealloc
{
    [model release];
    [manufacturer release];
}

@end

```

Explicando o código, os dois primeiros métodos são apenas
*getters*, sem nada de especial. Já nos *setters*, eu faço primeiro
a verificação se os objetos tem a mesma referência. Isso deve-se
ao fato de que, se eu fizer `release` no objeto antigo
(`manufacturer`), eu também estou fazendo release no objeto novo
(`input`).

Quando eles forem diferentes, faço o `release` do objeto
antigo e faço o `retain` no novo, simples. Seguindo essa
ideia, podemos ver que gerência de memória nos vem de graça quando
usamos *getters* e *setters*, cabe ao programador gerenciar apenas o que
está em seu escopo, como vemos no exemplo:

```objectivec

    Car *car = [[Car alloc] init];

    // Exemplo apenas ilustrativo
    NSString* model = [[NSString alloc] initWithString:@"Carrera"];
    [car setModel:model];
    [model release];


    [car release];

```


## Finalmente, properties

Properties são um jeito em Objective-C de se criar *getters* e *setters*,
e de graça ganhar um "syntax sugar". Vejamos o exemplo Car, reescrito:

Car.h
```objectivec
#import <Cocoa/Cocoa.h>


@interface Car : NSObject
{
    NSString* manufacturer;
    NSString* model;
}

@property (retain) manufacturer;
@property (retain) model;

@end
```


Car.m
```objectivec

#import "Car.h"

@implementation Car

@synthesize manufacturer, model;

- (void)dealloc
{
    [self setModel:nil];
    [self setManufacturer:nil];
    [super dealloc];
}

@end

```

O `@property` serve para declarar a interface e também
comportamentos dessa propriedade. Nesse caso, estamos declarando o atributo
`retain` que define que os métodos *setters* usem
`retain`. Existem vários atributos possíveis:

* `retain`: Utiliza retain para associar, bem similar com o que
  fizemos anteriormente;
* `assign`: Faz simplesmente o assign simples, serve para tipos
  simples (NSInteger/int, por exemplo) ou quando tiver GC ligado;
* `nonatomic`: Bastante utilizado no iOS, não utiliza locks para
  para fazer associações (multi-thread);
* `copy`: Chama o método `copy` para criar um objeto clone
  do parâmetro.

Existem alguns outros, vale a pena ler a documentação oficial para saber mais:
[Declared properties attributes](http://developer.apple.com/library/ios/documentation/Cocoa/Conceptual/ObjectiveC/Articles/ocProperties.html#//apple_ref/doc/uid/TP30001163-CH17-SW2).


Na implementação, usamos o `@synthesize` para informar ao compilador
que ele deve sintetizar os métodos, caso você não o faça.

**Importante:** O `@synthesize` **não** implementa nada para
o `dealloc`, por isso você precisa fazer o `release`
manualmente, como feito no exemplo acima.

### Syntax Sugar

A property ainda introduz um sintax sugar mais familiar para os Rubistas. Ao
invés de ter que fazer:

Antigo:
```objectivec
    [car setModel:model];
```

Novo:
```objectivec
    car.model = model;
```

Para obter o valor é a mesma coisa. Isso facilita para pessoas que vem de outra
linguagem e diminui o "barulho" da sintaxe com colchetes, que algumas pessoas
não gostam. Compare:

Colchetes:
```objectivec
homeButton = ...
[[self getNavigationItem] setLeftBarButtonItem:homeButton];
```

"Dot-syntax":
```objectivec
homeButton = ...
self.navigationItem.leftBarButtonItem = homeButton;
```

Isso encerra o conteúdo sobre properties em Objective-C. Esse post foi
basicamente uma compilação das seguintes referências:

* [Learn Objective-C &mdash; Cocoa Dev Central](http://cocoadevcentral.com/d/learn_objectivec/)
* [Declared properties &mdash; Doc. oficial](http://developer.apple.com/library/ios/documentation/Cocoa/Conceptual/ObjectiveC/Articles/ocProperties.html#//apple_ref/doc/uid/TP30001163-CH17-SW1)
* [Memory Management Programming Guide &mdash; Doc. oficial](http://developer.apple.com/library/mac/#documentation/Cocoa/Conceptual/MemoryMgmt/MemoryMgmt.html#//apple_ref/doc/uid/10000011-SW1)

## Apêndice: Autorelease Pools

Uma coisa que eu não mencionei no artigo é a possibilidade de usar
`autorelease`, conforme demonstrado abaixo:


```objectivec
NSString* anotherCoolString = [[[NSString alloc]
                                initWithString:@"Cool string!"]
                                autorelease];
```


O `autorelease` coloca o objeto em um "autorelease pool", no qual vai
ser liberado automaticamente pelo sistema poucos momentos depois (mais detalhes
virão). Mas há de se pensar, qual a diferença de um garbage collector?

A diferença é que o autorelease pool não verifica se há referências ao
objeto. Uma vez que o autorelease pool decida que vai liberar a referência do
objeto, outras referências automaticamente se tornarão inválidas. Em
contrapartida, o Garbage collector só vai liberar se não houver referências.

Os "autorelease pools" são criados no início de um event-loop e esvaziados no
final quando está sendo usado algum Kit, como iOS ou Mac. Quando se faz
programas de linha de comando, é necessário cria-las e esvazia-las manualmente.

Mas então quer dizer que eu posso simplesmente sair chamando
`:autorelease` nos objetos? Não. O problema de se usar o autorelease
pool é o alto consumo de memória se não for controlado e o fato do autorelease
pool ser constantemente esvaziado pode causar inconsistências na sua app &mdash;
objetos serem liberados da memória antes do previsto.

Mais detalhes na [documentação oficial](http://developer.apple.com/library/mac/#documentation/cocoa/Conceptual/MemoryMgmt/Articles/mmAutoreleasePools.html).
