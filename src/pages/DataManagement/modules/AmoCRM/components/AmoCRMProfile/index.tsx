const AmoCRMProfile = ({amoCrmDomainName}: {amoCrmDomainName: string}) => {
  return (
    <div className="accounts_dropdown flex justify-start p-3 flex-row">
      <div className="flex w-full items-center text-sm justify-between">
        <div className="text-left"><p>Аккаунт в amoCRM</p><p>{amoCrmDomainName || 'account.amocrm.ru'}</p></div>
        <div className="text-red-600 underline">Отключить</div>
      </div>
    </div>
  )
}

export default AmoCRMProfile
