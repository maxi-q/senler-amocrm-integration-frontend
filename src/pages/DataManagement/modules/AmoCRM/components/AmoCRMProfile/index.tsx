const AmoCRMProfile = ({amoCrmDomainName}: {amoCrmDomainName: string}) => {
  return (
    <div className="accounts_dropdown flex justify-start p-3 flex-row">
      <div className="flex items-center ">
        <div className="m-2 mt-2 mb-2"></div>
        <div>
          <span data-role="header_account_text" >Подключен профиль {amoCrmDomainName}</span>
        </div>
      </div>
    </div>
  )
}

export default AmoCRMProfile
